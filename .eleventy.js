module.exports = function (eleventyConfig) {

  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy('src/favicon.ico');
  eleventyConfig.addPassthroughCopy('src/sw.js');
  eleventyConfig.addPassthroughCopy('src/site.webmanifest');

  return {
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    
    dir: {
      input: 'src',
      includes: '_includes',
      layouts: '_layouts',
      data: '_data',
      output: '_site',
    }
  }
}