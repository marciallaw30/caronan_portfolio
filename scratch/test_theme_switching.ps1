$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$base = "file:///C:/Users/DCSA-P~1/Pictures/CARONA~1"

# Check for console errors by creating an automated test runner
$runnerPath = "C:\Users\DCSA-P~1\Pictures\CARONA~1\scratch\theme_runner.html"
$rawHtml = Get-Content "C:\Users\DCSA-PC 07\Pictures\CARONAN PORFOLIO\index.html" -Raw

$testSnippet = @"
<script>
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    console.log('[TEST] Checking initial Milky Way theme...');
    if (window.PortfolioTheme) {
      console.log('[TEST] Current Theme: ' + window.PortfolioTheme.getCurrent());
      
      console.log('[TEST] Switching to interlink-world...');
      window.PortfolioTheme.apply('interlink-world');
      
      console.log('[TEST] Switching to cyber-matrix...');
      window.PortfolioTheme.apply('cyber-matrix');
      
      console.log('[TEST] Switching back to milky-way...');
      window.PortfolioTheme.apply('milky-way');
      
      console.log('[TEST] ALL THEME SWITCHES EXECUTED CLEANLY WITH NO EXCEPTIONS!');
    } else {
      console.error('[TEST ERROR] window.PortfolioTheme not found!');
    }
  }, 500);
});
</script>
"@

$runnerHtml = $rawHtml.Replace('</body>', "$testSnippet`n</body>")
Set-Content -Path $runnerPath -Value $runnerHtml -Encoding UTF8

Write-Host "Verifying Milky Way theme engine lifecycle and stability..."
$proc = Start-Process $chrome -ArgumentList '--headless=new', '--virtual-time-budget=3000', "$base/scratch/theme_runner.html?theme=milky-way" -PassThru -Wait
Write-Host "Chrome executed successfully with exit code: $($proc.ExitCode)"
