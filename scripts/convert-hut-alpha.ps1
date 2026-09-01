param(
  [Parameter(Mandatory = $true)][string]$InputPath,
  [Parameter(Mandatory = $true)][string]$OutputPath
)

Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class HutAlphaConverter
{
    public static void Convert(string inputPath, string outputPath)
    {
        using (var source = new Bitmap(inputPath))
        using (var rgba = new Bitmap(source.Width, source.Height, PixelFormat.Format32bppArgb))
        {
            using (var graphics = Graphics.FromImage(rgba))
            {
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.DrawImageUnscaled(source, 0, 0);
            }

            var rect = new Rectangle(0, 0, rgba.Width, rgba.Height);
            var data = rgba.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
            var bytes = new byte[Math.Abs(data.Stride) * rgba.Height];
            Marshal.Copy(data.Scan0, bytes, 0, bytes.Length);

            for (var y = 0; y < rgba.Height; y++)
            {
                for (var x = 0; x < rgba.Width; x++)
                {
                    var offset = y * data.Stride + x * 4;
                    var b = bytes[offset];
                    var g = bytes[offset + 1];
                    var r = bytes[offset + 2];
                    var max = Math.Max(r, Math.Max(g, b));
                    var min = Math.Min(r, Math.Min(g, b));
                    if (min >= 228 && max - min <= 10)
                    {
                        bytes[offset] = 0;
                        bytes[offset + 1] = 0;
                        bytes[offset + 2] = 0;
                        bytes[offset + 3] = 0;
                    }
                }
            }

            Marshal.Copy(bytes, 0, data.Scan0, bytes.Length);
            rgba.UnlockBits(data);

            using (var output = new Bitmap(362, 272, PixelFormat.Format32bppArgb))
            using (var graphics = Graphics.FromImage(output))
            {
                graphics.CompositingMode = CompositingMode.SourceCopy;
                graphics.InterpolationMode = InterpolationMode.NearestNeighbor;
                graphics.PixelOffsetMode = PixelOffsetMode.Half;
                graphics.DrawImage(rgba, new Rectangle(0, 0, 362, 272));
                output.Save(outputPath, ImageFormat.Png);
            }
        }
    }
}
'@

[HutAlphaConverter]::Convert(
  (Resolve-Path -LiteralPath $InputPath).Path,
  [System.IO.Path]::GetFullPath($OutputPath)
)
