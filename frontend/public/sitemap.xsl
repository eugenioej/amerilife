<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="sm">

  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap</title>
        <style>
          body {
            font-family: Arial;
            padding: 20px;
          }

          h1 {
            margin-bottom: 20px;
          }

          details {
            margin-bottom: 15px;
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 10px;
          }

          summary {
            font-weight: bold;
            cursor: pointer;
            font-size: 16px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          th, td {
            border: 1px solid #ddd;
            padding: 6px;
            font-size: 13px;
          }

          th {
            background: #f4f4f4;
          }

          a {
            color: #0073aa;
            text-decoration: none;
          }

          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>

      <body>
        <h1>Sitemap</h1>

        <!-- ✅ PAGES -->
        <details>
          <summary>Pages</summary>
          <table>
            <tr><th>URL</th><th>Freq</th><th>Priority</th></tr>
            
            
            <xsl:for-each select="
              sm:urlset/sm:url[sm:priority = 1 or sm:priority = 0.8]
            ">

              <tr>
                <td><a href="{sm:loc}" target="_blank"><xsl:value-of select="sm:loc"/></a></td>
                <td><xsl:value-of select="sm:changefreq"/></td>
                <td><xsl:value-of select="sm:priority"/></td>
              </tr>
            </xsl:for-each>
          </table>
        </details>

        <!-- ✅ BLOG POSTS -->
        <details>
          <summary>Blog Posts</summary>
          <table>
            <tr><th>URL</th><th>Freq</th><th>Priority</th></tr>
            
            <xsl:for-each select="sm:urlset/sm:url[sm:priority = 0.7]">
              <tr>
                <td><a href="{sm:loc}" target="_blank"><xsl:value-of select="sm:loc"/></a></td>
                <td><xsl:value-of select="sm:changefreq"/></td>
                <td><xsl:value-of select="sm:priority"/></td>
              </tr>
            </xsl:for-each>
          </table>
        </details>

        <!-- INSIGHTS -->
        <details>
          <summary>Insights</summary>
          <table>
            <tr><th>URL</th><th>Freq</th><th>Priority</th></tr>
            <xsl:for-each select="sm:urlset/sm:url[sm:priority = 0.75]">
              <tr>
                <td><a href="{sm:loc}" target="_blank"><xsl:value-of select="sm:loc"/></a></td>
                <td><xsl:value-of select="sm:changefreq"/></td>
                <td><xsl:value-of select="sm:priority"/></td>
              </tr>
            </xsl:for-each>
          </table>
        </details>

        <!-- LEADERS -->
        <details>
          <summary>Leaders</summary>
          <table>
            <tr><th>URL</th><th>Freq</th><th>Priority</th></tr>
            <xsl:for-each select="sm:urlset/sm:url[sm:priority = 0.65]">
              <tr>
                <td><a href="{sm:loc}" target="_blank"><xsl:value-of select="sm:loc"/></a></td>
                <td><xsl:value-of select="sm:changefreq"/></td>
                <td><xsl:value-of select="sm:priority"/></td>
              </tr>
            </xsl:for-each>
          </table>
        </details>

        <!-- LOCATIONS / AGENCIES -->
        <details>
          <summary>Locations / Agencies</summary>
          <table>
            <tr><th>URL</th><th>Freq</th><th>Priority</th></tr>
            <xsl:for-each select="sm:urlset/sm:url[sm:priority = 0.6]">
              <tr>
                <td><a href="{sm:loc}" target="_blank"><xsl:value-of select="sm:loc"/></a></td>
                <td><xsl:value-of select="sm:changefreq"/></td>
                <td><xsl:value-of select="sm:priority"/></td>
              </tr>
            </xsl:for-each>
          </table>
        </details>

      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>