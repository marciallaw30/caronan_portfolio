# Launch Mythic Gambit 3D & Arcade Game Dev Simulator
Write-Host "========================================================" -ForegroundColor Yellow
Write-Host "  Launching Mythic Gambit 3D & Arcade Game Dev Simulator" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Yellow

$simPath = Join-Path $PSScriptRoot "game-dev\simulator.html"
if (Test-Path $simPath) {
    Start-Process $simPath
    Write-Host "Opened $simPath in default browser!" -ForegroundColor Green
} else {
    Write-Error "Could not find simulator.html at $simPath"
}
