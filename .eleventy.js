const fs = require('fs');
const { DateTime } = require('luxon');
const markdownIt = require('markdown-it');
const markdownLib = markdownIt({ html: true, typographer: true });
const md = new markdownIt();
const responsiveImage = require('./src/_includes/shortcodes/responsive-image');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const typographyPlugin = require('@jamshop/eleventy-plugin-typography');

module.exports = function(eleventyConfig) {
    eleventyConfig.addWatchTarget('src/scss');

    eleventyConfig.setLibrary('md', markdownLib);

    eleventyConfig.addFilter('markdown', value => md.renderInline(value));

    eleventyConfig.addShortcode('responsiveImage', responsiveImage);

    eleventyConfig.addPassthroughCopy('src/img');
    eleventyConfig.addPassthroughCopy('src/robots.txt');
    eleventyConfig.addPassthroughCopy('src/favicon.ico');

    eleventyConfig.addPlugin(pluginRss);
    eleventyConfig.addPlugin(typographyPlugin);

    // https://moment.github.io/luxon/docs/manual/parsing.html#parsing-technical-formats
    eleventyConfig.addFilter('fullDate', dateObj => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('cccc, LLLL dd, yyyy');
    });
    eleventyConfig.addFilter('midDate', dateObj => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('LLLL dd, yyyy');
    });
    eleventyConfig.addFilter('shortDate', dateObj => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
    });

    // Make 404 page work with `eleventy --serve`
    eleventyConfig.setBrowserSyncConfig({
        callbacks: {
            ready: function(err, browserSync) {
                const content_404 = fs.readFileSync('public/404.html');

                browserSync.addMiddleware('*', (req, res) => {
                    // Provides the 404 content without redirect.
                    res.write(content_404);
                    res.end();
                });
            }
        }
    });

    return {
        dir: {
            input: 'src',
            output: 'public',
        },
    };
};
