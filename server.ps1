# Multi-Threaded PowerShell HTTP Web Server
# Serves BSIT Portfolio on Localhost without blocking or hanging

$port = 8080
$rootPath = $PSScriptRoot

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

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
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".md"   = "text/plain; charset=utf-8"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $workerState = @($context, $mimeTypes, $rootPath)

        [System.Threading.ThreadPool]::QueueUserWorkItem({
                param($state)
                $ctx = $state[0]
                $types = $state[1]
                $root = $state[2]

                try {
                    $req = $ctx.Request
                    $res = $ctx.Response

                    $localPath = $req.Url.LocalPath
                    if ($localPath -eq "/" -or [string]::IsNullOrWhiteSpace($localPath)) {
                        $localPath = "/index.html"
                    }
                    
                    $localPath = $localPath.TrimStart('/').Replace('/', '\')
                    $filePath = [System.IO.Path]::Combine($root, $localPath)
                    
                    if ([System.IO.File]::Exists($filePath)) {
                        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                        
                        $contentType = "application/octet-stream"
                        if ($types.ContainsKey($ext)) {
                            $contentType = $types[$ext]
                        }
                        $res.ContentType = $contentType
                        
                        $bytes = [System.IO.File]::ReadAllBytes($filePath)
                        $res.ContentLength64 = $bytes.Length
                        
                        if ($req.HttpMethod -ne "HEAD") {
                            $res.OutputStream.Write($bytes, 0, $bytes.Length)
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
                    # Handle error
                }
                finally {
                    try {
                        $ctx.Response.OutputStream.Close()
                        $ctx.Response.Close()
                    }
                    catch {}
                }
            }, $workerState) | Out-Null
    }
    catch {
        # continue loop
    }
}
