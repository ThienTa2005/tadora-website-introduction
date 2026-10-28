Add-Type -AssemblyName System.Drawing

$sourcePath = Join-Path $PSScriptRoot "..\public\logo-tadora.png"
$markPath = Join-Path $PSScriptRoot "..\public\logo-tadora-mark.png"
$wordmarkPath = Join-Path $PSScriptRoot "..\public\logo-tadora-wordmark.png"

$source = [System.Drawing.Bitmap]::FromFile($sourcePath)

try {
  $markRect = New-Object System.Drawing.Rectangle(490, 220, 580, 475)
  $wordmarkRect = New-Object System.Drawing.Rectangle(275, 690, 990, 155)

  $mark = $source.Clone($markRect, $source.PixelFormat)
  $wordmark = $source.Clone($wordmarkRect, $source.PixelFormat)

  try {
    $mark.Save($markPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $wordmark.Save($wordmarkPath, [System.Drawing.Imaging.ImageFormat]::Png)
  }
  finally {
    $mark.Dispose()
    $wordmark.Dispose()
  }
}
finally {
  $source.Dispose()
}
