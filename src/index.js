'use strict';

const path = require('path');
const fs = require('fs');
const marked = require('marked');
const chalk = require('chalk');
const renderer = Object.create(new marked.Renderer());

// copied from marked
function unescape(html) {
  return html.replace(/&([#\w]+);/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

const headingRenderer = renderer.heading.bind(renderer);
renderer.heading = (text, level) => {
	if (level === 1) {
		tipHeading = text;
		return '';
	} else {
		return unescape(headingRenderer(text, level));
	}
}

const hrRenderer = renderer.hr.bind(renderer);
renderer.hr = () => {
	return 'PROTIPS_HORIZONTAL_RULE';
}

const codeRenderer = renderer.code.bind(renderer);
renderer.code = (text) => {
	return unescape(chalk.cyan(`\n\n${text}\n`));
}

const paragraphRenderer = renderer.paragraph.bind(renderer);
renderer.paragraph = (text) => {
	return unescape(`\n${text}`);
}

const emRenderer = renderer.em.bind(renderer);
renderer.em = (text) => {
	return unescape(chalk.yellow(`${text}`));
}

const strongRenderer = renderer.strong.bind(renderer);
renderer.strong = (text) => {
	return unescape(chalk.underline.red(`${text}`));
}

const codespanRenderer = renderer.codespan.bind(renderer);
renderer.codespan = (text) => {
	return unescape(chalk.cyan(`\`${text}\``));
}

const brRenderer = renderer.br.bind(renderer);
renderer.br = () => {
	return unescape('\n');
}

const linkRenderer = renderer.link.bind(renderer);
renderer.link = href => {
	return unescape(chalk.magenta(href));
}

let tipHeading = '';

marked.setOptions({
  renderer: renderer
});

function getProtips (sources) {
	return sources
		.map(source => {

			if (/\.(md|markdown)$/.test(source)) {
				return fs.readFileSync(source, 'utf8');
			}
		})
		.reduce((tips, md) => {
			tipHeading = '';
			return tips.concat(marked(md)
				.split('PROTIPS_HORIZONTAL_RULE')
				.map(tip => {
					return `${chalk.green(`${protips.bookend}Pro tip for ${tipHeading}:`)}${tip}${protips.bookend ? chalk.green('\n/* * * * * * * * * * * * * * * * * * * * * * * */') : ''}`;
				}));
		}, []);
}

function protips (...sources) {
	const tips = getProtips(sources);
	protips.log(tips[Math.floor(Math.random() * tips.length)]);
}

module.exports = protips;

module.exports.bookend = '/* * * * * * * * * * * * * * * * * * * * * * * */\n';

module.exports.all = function (...sources) {
	const tips = getProtips(sources);
	tips.forEach(tip => protips.log(tip));
}

module.exports.log = text => {
	process.on('exit', () => {
		console.log(text);
	});
}