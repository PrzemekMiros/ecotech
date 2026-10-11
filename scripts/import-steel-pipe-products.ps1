param(
  [string]$InputFile = 'C:\Users\User\Downloads\wc-product-export-11-10-2026-1791738051633.csv',
  [switch]$Force
)

$ErrorActionPreference = 'Stop'

$zDot = [char]0x017C
$lStroke = [char]0x0142
$sAcuteUpper = [char]0x015A
$sAcute = [char]0x015B
$aOgonek = [char]0x0105
$eOgonek = [char]0x0119
$oAcute = [char]0x00F3
$cAcute = [char]0x0107

$categoryMap = @{
  'Rury stalowe bez szwu' = 'bez-szwu'
  'Rury stalowe dwudzielne' = 'dwudzielne'
  "Rury stalowe u$($zDot)ywane" = 'uzywane'
  'Rury stalowe w izolacji' = 'w-izolacji'
  'Rury stalowe ze szwem spiralnym' = 'ze-szwem-spiralnym'
  "Rury stalowe ze szwem wzd$($lStroke)u$($zDot)nym" = 'ze-szwem-wzdluznym'
  'Rury stalowe zwijane z blachy' = 'zwijane-z-blachy'
}

$outputDirectory = Join-Path $PSScriptRoot '..\src\content\steel-pipe-products'
$outputDirectory = [IO.Path]::GetFullPath($outputDirectory)
$utf8 = [Text.UTF8Encoding]::new($false)

function ConvertTo-YamlString([string]$Value) {
  if ($null -eq $Value) { return '""' }

  $escaped = $Value.Replace('\', '\\').Replace('"', '\"').Replace("`r`n", '\n').Replace("`n", '\n').Replace("`r", '\n')
  return '"' + $escaped + '"'
}

function ConvertTo-Slug([string]$Value) {
  $normalized = $Value.ToLowerInvariant().Replace([string][char]0x0142, 'l').Replace([string][char]0x0141, 'l').Normalize([Text.NormalizationForm]::FormD)
  $builder = [Text.StringBuilder]::new()

  foreach ($character in $normalized.ToCharArray()) {
    if ([Globalization.CharUnicodeInfo]::GetUnicodeCategory($character) -ne [Globalization.UnicodeCategory]::NonSpacingMark) {
      [void]$builder.Append($character)
    }
  }

  return ([regex]::Replace($builder.ToString(), '[^a-z0-9]+', '-')).Trim('-')
}

function ConvertTo-CleanText([string]$Value) {
  if ($null -eq $Value) { return '' }
  return $Value.Replace('\,', ',').Trim()
}

$products = Import-Csv -LiteralPath $InputFile | Where-Object {
  $_.Rodzaj -eq 'simple' -and $_.Opublikowano -eq '1'
}

$written = 0
$skipped = 0

foreach ($product in $products) {
  $category = $categoryMap[$product.Kategorie]
  if (-not $category) {
    throw "Missing category mapping: $($product.Kategorie)"
  }

  $title = ConvertTo-CleanText $product.Nazwa
  $slug = ConvertTo-Slug $title
  $path = Join-Path $outputDirectory "$slug.md"

  if ((Test-Path -LiteralPath $path) -and -not $Force) {
    $skipped++
    continue
  }

  $parameters = [System.Collections.Generic.List[object]]::new()
  for ($index = 1; $index -le 5; $index++) {
    $attributeNameColumn = "Nazwa atrybutu $index"
    $attributeValueColumn = "Warto$($sAcute)ci atrybutu $index"
    $label = ConvertTo-CleanText $product.PSObject.Properties[$attributeNameColumn].Value
    $value = ConvertTo-CleanText $product.PSObject.Properties[$attributeValueColumn].Value
    if ($label -and $value) {
      $parameters.Add([PSCustomObject]@{ Label = $label; Value = $value })
    }
  }

  $diameter = ($parameters | Where-Object Label -eq "$($sAcuteUpper)rednica" | Select-Object -First 1).Value
  $wall = ($parameters | Where-Object Label -eq "$($sAcuteUpper)cianka" | Select-Object -First 1).Value
  $grade = ($parameters | Where-Object Label -eq 'Gatunek' | Select-Object -First 1).Value
  $specification = if ($diameter -and $wall) { "$diameter x $wall" } elseif ($diameter) { $diameter } else { '' }
  $shortDescriptionColumn = "Kr$($oAcute)tki opis"
  $description = (ConvertTo-CleanText $product.PSObject.Properties[$shortDescriptionColumn].Value).Replace('[page_title]', $title)
  $parameterSummary = ($parameters | ForEach-Object { "$($_.Label): $($_.Value)" }) -join '; '
  $technicalSummary = "$title. Parametry techniczne obejmuj$($aOgonek): $parameterSummary. Dost$($eOgonek)pno$($sAcute)$($cAcute), wymagania jako$($sAcute)ciowe i warunki dostawy potwierdzamy dla wybranej specyfikacji w odpowiedzi na zapytanie."
  $body = (ConvertTo-CleanText $product.Opis).Replace('\n', "`n")

  $frontmatter = [System.Collections.Generic.List[string]]::new()
  $frontmatter.Add('---')
  $frontmatter.Add("title: $(ConvertTo-YamlString $title)")
  $frontmatter.Add("slug: $(ConvertTo-YamlString $slug)")
  $frontmatter.Add("sku: $(ConvertTo-YamlString (ConvertTo-CleanText $product.SKU))")
  $frontmatter.Add("category: $(ConvertTo-YamlString $category)")
  $frontmatter.Add("description: $(ConvertTo-YamlString $description)")
  if ($specification) { $frontmatter.Add("specification: $(ConvertTo-YamlString $specification)") }
  $frontmatter.Add("technicalSummary: $(ConvertTo-YamlString $technicalSummary)")
  if ($grade) { $frontmatter.Add("steelGrade: $(ConvertTo-YamlString $grade)") }
  $frontmatter.Add('technicalParameters:')
  foreach ($parameter in $parameters) {
    $frontmatter.Add("  - label: $(ConvertTo-YamlString $parameter.Label)")
    $frontmatter.Add("    value: $(ConvertTo-YamlString $parameter.Value)")
  }
  $frontmatter.Add("order: $($product.Pozycja)")
  $frontmatter.Add('---')

  $content = ($frontmatter -join "`n") + "`n`n" + $body.Trim() + "`n"
  [IO.File]::WriteAllText($path, $content, $utf8)
  $written++
}

Write-Output "Created: $written. Skipped existing: $skipped. Total import rows: $($products.Count)."
