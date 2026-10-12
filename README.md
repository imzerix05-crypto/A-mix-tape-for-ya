# A Mixtape for You ♡

A static, mobile-friendly mixtape creator made with HTML, CSS, and vanilla JavaScript.

## Files
- `index.html` — page structure
- `style.css` — styling and animations
- `script.js` — creator, YouTube links, and shareable mixtape URLs

## Run it
Open `index.html` in a browser, or publish the folder using GitHub Pages.

## Publish with GitHub Pages
1. Create/open a GitHub repository.
2. Upload `index.html`, `style.css`, and `script.js` to the repository root.
3. Open **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**, select your main branch and `/ (root)`, then save.
5. After GitHub Pages publishes the site, open the published URL and test the creator.
6. Finish a mixtape and press **Share mixtape link ♡**. Send that generated link to the recipient.

## Important notes
- This version stores the mixtape data inside the share URL, so it does not need a database. Very long messages or many songs can create a long URL.
- Anyone with the link may be able to decode the data in the URL. Don't include private or sensitive information.
- YouTube videos are played through YouTube's embedded player and may be unavailable for embedding depending on the video's settings.
- The page needs to be published on GitHub Pages for the recipient to open a working public link. A local `file://` link will not work for someone else.
