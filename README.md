# google-save-exporter
Export bookmarks from google save(https://www.google.com/save)

![screencast](https://raw.githubusercontent.com/bit3725/google-save-exporter/master/images/screencast.gif)

## How to use

1. `git clone git@github.com:bit3725/google-save-exporter.git`
2. `cd google-save-exporter`
3. `npm install`
4. `node index.js`
5. type in your google account and password

## Output

Exporter can generate two files with exported bookmarks from google save page.

**bookmarks_with_tag.html** is suitable for the bookmark service that support tags.

```html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><P>
  <DT><A HREF="https://github.com/vasanthk/react-bits" ADD_DATE="1510219014" LAST_MODIFIED="1510219019" TAGS="react">vasanthk/react-bits: ✨ React patterns, techniques, tips and tricks ✨</A>
  <DT><A HREF="https://medium.com/react-native-training/react-animations-in-depth-433e2b3f0e8e" ADD_DATE="1506659369" LAST_MODIFIED="1506840630" TAGS="react,animation">React Animations in Depth – React Native Training – Medium</A>
  <DT><A HREF="https://medium.com/dev-channel/treebo-a-react-and-preact-progressive-web-app-performance-case-study-5e4f450d5299" ADD_DATE="1506660362" LAST_MODIFIED="1506660374" TAGS="react,frontend-dev">A React And Preact Progressive Web App Performance Case Study: Treebo</A>
</DL><P>
```

**bookmarks_with_folder.html** is suitable for browser bookmark manager that manages bookmarks with folder.

```html
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><P>
  <DT><H3>react</H3>
  <DL><P>
    <DT><A HREF="https://github.com/vasanthk/react-bits" ADD_DATE="1510219014" LAST_MODIFIED="1510219019">vasanthk/react-bits: ✨ React patterns, techniques, tips and tricks ✨</A>
    <DT><A HREF="https://medium.com/react-native-training/react-animations-in-depth-433e2b3f0e8e" ADD_DATE="1506659369" LAST_MODIFIED="1506840630">React Animations in Depth – React Native Training – Medium</A>
    <DT><A HREF="https://medium.com/dev-channel/treebo-a-react-and-preact-progressive-web-app-performance-case-study-5e4f450d5299" ADD_DATE="1506660362" LAST_MODIFIED="1506660374">A React And Preact Progressive Web App Performance Case Study: Treebo</A>
  </DL><P>
</DL><P>
```
