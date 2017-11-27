const fs = require('fs');
const prompt = require('prompt');
const colors = require('colors/safe');
const puppeteer = require('puppeteer');

const indent = function(num) {
  return new Array(num * 2 + 1).join(' ');
};

prompt.message = '';
prompt.delimiter = '';

const schema = {
  properties: {
    email: {
      description: colors.green('Google Account:'),
      required: true
    },
    password: {
      description: colors.green('Google Password:'),
      required: true,
      hidden: true
    }
  }
};

prompt.start();

prompt.get(schema, function(err, result) {
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const homepage = 'https://www.google.com/save'
    await page.goto(homepage);
    await page.waitForSelector('#identifierNext');
    console.log('Type in google account...');
    await page.type('input[type="email"]', result.email);
    await page.click('#identifierNext')
    await page.waitForSelector('input[type="password"]', {visible: true});
    console.log('Type in google password...');
    await page.type('input[type="password"]', result.password);
    await page.click('#passwordNext');
    await page.waitForSelector('.str-tag-card-holder', {visible: true});
    console.log('Open goolge save page...');
    const tagNameNodes = await page.$$eval('.str-tag-card-holder .str-list-card-title', titles => {
      return titles.map(title => title.innerHTML);
    });
    let index = 0;
    let currentTag = tagNameNodes[index];
    const exportLinksWithTag = {};
    const exportLinksWithFolder = {};
    page.on('response', async response => {
      const url = response.url;
      if (url.indexOf('https://www.google.com/save/listitems') === 0) {
        if (url.indexOf('cdt_sp') < 0 && url.indexOf('dt_fav_images') < 0) {
          const tagPageResponseText = await response.text();
          const tagPageData = JSON.parse(tagPageResponseText.substring(5))[0];
          if (tagPageData.length > 0) {
            tagPageData.forEach(page => {
              if (!exportLinksWithTag[page[5]]) {
                exportLinksWithTag[page[5]] = {
                  title: page[6],
                  tags: [],
                  addDate: page[15][0],
                  lastModifiedDate: page[16][0]
                };
              }
              exportLinksWithTag[page[5]].tags.push(currentTag);

              if (!exportLinksWithFolder[currentTag]) {
                exportLinksWithFolder[currentTag] = [];
              }
              exportLinksWithFolder[currentTag].push({
                title: page[6],
                url: page[5],
                addDate: page[15][0],
                lastModifiedDate: page[16][0]
              });
            });
            console.log(`Find ${tagPageData.length} bookmarks in ${currentTag} tag`);
          }
        }
        index++;
        if (index < tagNameNodes.length - 1) {
          try {
            await page.goto(homepage, {waitUntil: 'networkidle0'});
          } catch(e) {
            console.log('Fail to back to homepage', e);
            console.log('retry...');
            await page.goto(homepage, {waitUntil: 'networkidle0'});
          }
          currentTag = tagNameNodes[index];
          page.click(`.str-card-list .str-clip-card-space:nth-child(${index + 1}) .str-tag-card-holder`);
        } else {
          await browser.close();

          const HEADS = ['<!DOCTYPE NETSCAPE-Bookmark-file-1>',
            '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">',
            '<TITLE>Bookmarks</TITLE>',
            '<H1>Bookmarks</H1>'];

          const LINKS_WITH_TAG = [];
          for (const linkUrl in exportLinksWithTag) {
            if (exportLinksWithTag.hasOwnProperty(linkUrl)) {
              const linkProperties = exportLinksWithTag[linkUrl];
              LINKS_WITH_TAG.push(`${indent(1)}<DT><A HREF="${linkUrl}" ADD_DATE="${linkProperties.addDate}" LAST_MODIFIED="${linkProperties.lastModifiedDate}" TAGS="${linkProperties.tags.join(",")}">${linkProperties.title}</A>`);
            }
          }
          const LINKS_WITH_TAG_OUTPUT = `${HEADS.join("\n")}\n<DL><P>\n${LINKS_WITH_TAG.join("\n")}\n</DL><P>`;

          const LINKS_WITH_FOLDER = [];
          for (const folder in exportLinksWithFolder) {
            if (exportLinksWithFolder.hasOwnProperty(folder)) {
              const links = exportLinksWithFolder[folder];
              LINKS_WITH_FOLDER.push(`${indent(1)}<DT><H3>${folder}</H3>`);
              LINKS_WITH_FOLDER.push(`${indent(1)}<DL><P>`);
              for (const link of links) {
                LINKS_WITH_FOLDER.push(`${indent(2)}<DT><A HREF="${link.url}" ADD_DATE="${link.addDate}" LAST_MODIFIED="${link.lastModifiedDate}">${link.title}</A>`);
              }
              LINKS_WITH_FOLDER.push(`${indent(1)}</DL><P>`);
            }
          }
          const LINKS_WITH_FOLDER_OUTPUT = `${HEADS.join("\n")}\n<DL><P>\n${LINKS_WITH_FOLDER.join("\n")}\n</DL><P>`;

          console.log('Export bookmarks with tags...');
          await fs.writeFile('bookmarks_with_tag.html', LINKS_WITH_TAG_OUTPUT);
          console.log("Export bookmarks with folders...");
          await fs.writeFile("bookmarks_with_folder.html", LINKS_WITH_FOLDER_OUTPUT);
        }
      }
    })
    page.click(`.str-card-list .str-clip-card-space:nth-child(${index + 1}) .str-tag-card-holder`);
  })()
});
