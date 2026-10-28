# Robust PowerShell HTTP Web Server with HTTP 206 Range (Video Seeking) Support
# Serves BSIT Portfolio on Localhost without thread crashes or hanging

$port = 8080
$rootPath = $PSScriptRoot

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "=========================================================="
    Write-Host "   DCSA BSIT PORTFOLIO LIVE SERVER ACTIVE"
    Write-Host "   Localhost Link: http://localhost:$port/"
    Write-Host "   Localhost File: http://localhost:$port/index.html"
    Write-Host "=========================================================="
}
catch {
    Write-Error ("Failed to bind to port " + $port + ": " + $_)
    exit 1
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".webp" = "image/webp"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".md"   = "text/plain; charset=utf-8"
    ".sql"  = "text/plain; charset=utf-8"
    ".vtt"  = "text/vtt; charset=utf-8"
    ".xlsx" = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ".docx" = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ".pdf"  = "application/pdf"
    ".zip"  = "application/zip"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
    ".mp4"  = "video/mp4"
    ".webm" = "video/webm"
    ".mov"  = "video/quicktime"
}

while ($listener.IsListening) {
    try {
        $ctx = $listener.GetContext()
        $req = $ctx.Request
        $res = $ctx.Response

        try {
            $localPath = $req.Url.LocalPath
            if ($localPath -eq "/" -or [string]::IsNullOrWhiteSpace($localPath)) {
                $localPath = "/index.html"
            }
            
            $localPath = $localPath.TrimStart('/').Replace('/', '\')
            $filePath = [System.IO.Path]::Combine($rootPath, $localPath)
            
            if ([System.IO.Directory]::Exists($filePath)) {
                $filePath = [System.IO.Path]::Combine($filePath, "index.html")
            }

            if ([System.IO.File]::Exists($filePath)) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                
                $contentType = "application/octet-stream"
                if ($mimeTypes.ContainsKey($ext)) {
                    $contentType = $mimeTypes[$ext]
                }
                $res.ContentType = $contentType
                $res.AddHeader("Accept-Ranges", "bytes")

                $fileInfo = New-Object System.IO.FileInfo($filePath)
                $totalLength = $fileInfo.Length

                $rangeHeader = $req.Headers["Range"]
                if (-not [string]::IsNullOrEmpty($rangeHeader) -and $rangeHeader.StartsWith("bytes=")) {
                    $rangeSpec = $rangeHeader.Substring(6).Split('-')
                    $start = 0L
                    $end = $totalLength - 1L

                    if (-not [string]::IsNullOrEmpty($rangeSpec[0])) {
                        [long]::TryParse($rangeSpec[0], [ref]$start) | Out-Null
                    }
                    if ($rangeSpec.Length -gt 1 -and -not [string]::IsNullOrEmpty($rangeSpec[1])) {
                        [long]::TryParse($rangeSpec[1], [ref]$end) | Out-Null
                    }
                    if ($end -ge $totalLength) {
                        $end = $totalLength - 1L
                    }

                    $length = $end - $start + 1L
                    if ($length -gt 0 -and $start -lt $totalLength) {
                        $res.StatusCode = 206
                        $res.AddHeader("Content-Range", "bytes $start-$end/$totalLength")
                        $res.ContentLength64 = $length

                        if ($req.HttpMethod -ne "HEAD") {
                            $fs = [System.IO.File]::OpenRead($filePath)
                            try {
                                $fs.Seek($start, [System.IO.SeekOrigin]::Begin) | Out-Null
                                $buffer = New-Object byte[] 65536
                                $bytesRemaining = $length
                                while ($bytesRemaining -gt 0) {
                                    $toRead = [int][Math]::Min($buffer.Length, $bytesRemaining)
                                    $read = $fs.Read($buffer, 0, $toRead)
                                    if ($read -le 0) { break }
                                    $res.OutputStream.Write($buffer, 0, $read)
                                    $bytesRemaining -= $read
                                }
                            } finally {
                                $fs.Close()
                            }
                        }
                    } else {
                        $res.StatusCode = 416
                        $res.AddHeader("Content-Range", "bytes */$totalLength")
                    }
                } else {
                    $res.StatusCode = 200
                    $res.ContentLength64 = $totalLength
                    if ($req.HttpMethod -ne "HEAD") {
                        $fs = [System.IO.File]::OpenRead($filePath)
                        try {
                            $fs.CopyTo($res.OutputStream)
                        } finally {
                            $fs.Close()
                        }
                    }
                }
            }
            else {
                $res.StatusCode = 404
                $errorBytes = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found")
                $res.ContentType = "text/plain; charset=utf-8"
                $res.ContentLength64 = $errorBytes.Length
                if ($req.HttpMethod -ne "HEAD") {
                    $res.OutputStream.Write($errorBytes, 0, $errorBytes.Length)
                }
            }
        }
        catch {
            Write-Host "Request error: $_"
        }
        finally {
            try {
                $res.OutputStream.Close()
                $res.Close()
            }
            catch {}
        }
    }
    catch {
        Write-Host "Server loop error: $_"
    }
}
