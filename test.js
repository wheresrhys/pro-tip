'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const protips = require('./src/index');
const path = require('path');

describe('protips', () => {
	let i = 0;
	let n = 1;
	before(() => {
		protips.bookend = '';
	})
	beforeEach(() => {
		sinon.spy(protips, 'log');
		sinon.stub(Math, 'random', () => {
			return i/n;
		});
	});

	afterEach(() => {
		protips.log.restore();
		Math.random.restore();
		i = 0;
		n = 1;
	});

	it('read from custom markdown file', () => {
		protips(path.join(__dirname, 'fixtures/module1.md'));
		expect(protips.log.calledOnce).to.be.true;
		expect(protips.log.firstCall.args[0]).to.equal('\u001b[32mPro tip for module 1:\u001b[39m\ntip1');
	});

	it('pick a random entry', () => {
		i = 3;
		n = 6;
		protips(path.join(__dirname, 'fixtures/module1.md'));
		expect(protips.log.calledOnce).to.be.true;
		expect(protips.log.firstCall.args[0]).to.equal('\u001b[32mPro tip for module 1:\u001b[39m\ntip3  \u001b[36m\n\nwith code\nand code\n\u001b[39m');
	});

	it('read from multiple sources', () => {
		protips(path.join(__dirname, 'fixtures/module1.md'), path.join(__dirname, 'fixtures/module2.md'));
		expect(protips.log.calledOnce).to.be.true;
		expect(protips.log.firstCall.args[0]).to.equal('\u001b[32mPro tip for module 1:\u001b[39m\ntip1');
		i = 6;
		n = 8
		protips(path.join(__dirname, 'fixtures/module1.md'), path.join(__dirname, 'fixtures/module2.md'));
		expect(protips.log.calledTwice).to.be.true;
		expect(protips.log.lastCall.args[0]).to.equal('\u001b[32mPro tip for module 2:\u001b[39m\nmodule2 tooltip1');
	});

	it('output all tooltips', () => {
		protips.all(path.join(__dirname, 'fixtures/module1.md'));
		expect(protips.log.callCount).to.equal(5);
	});

	describe('tip content', () => {

		// TODO tests for tip content
	});
});