import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import B from 'bluebird';
import { UICATALOG_CAPS } from './desired';
import { initSession, deleteSession } from './helpers/session';


chai.should();
chai.use(chaiAsPromised);

describe('XCUITestDriver - basics', function () {
  this.timeout(200 * 1000);

  let driver;
  before(async () => {
    driver = await initSession(UICATALOG_CAPS);
  });
  after(deleteSession);

  describe('status', () => {
    it('should get the server status', async () => {
      let status = await driver.status();
      status.wda.should.exist;
    });
  });

  describe('source', () => {
    it('should get the source for the page', async () => {
      let src = await driver.source();
      (typeof src).should.eql('string');
      src.indexOf('<AppiumAUT>').should.not.eql(-1);
    });
  });

  describe('deactivate app', () => {
    it('should background the app for the specified time', async () => {
      let before = Date.now();
      await driver.backgroundApp(4);
      (Date.now() - before).should.be.above(4000);
      (await driver.source()).indexOf('<AppiumAUT>').should.not.eql(-1);
    });
  });

  describe('screenshot', () => {
    after(async () => {
      try {
        await driver.setOrientation("PORTRAIT");
      } catch (ign) {}
    });
    it('should get an app screenshot', async () => {
      (await driver.takeScreenshot()).should.exist;
    });

    it('should get an app screenshot in landscape mode', async () => {
      let screenshot1 = (await driver.takeScreenshot());
      screenshot1.should.exist;

      try {
        await driver.setOrientation("LANDSCAPE");
      } catch (ign) {}
      // take a little pause while it orients, otherwise you get the screenshot
      // on an angle
      await B.delay(500);

      let screenshot2 = await driver.takeScreenshot();
      screenshot2.should.exist;
      screenshot2.should.not.eql(screenshot1);
    });
  });
});
