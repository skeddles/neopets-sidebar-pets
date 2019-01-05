# Neopets Sidebar Pets Userscript
Adds all your neopets into your sidebar! The replaces the normal pet preview with one that shows your 4 pets. It will also show an icon if your pet is sick.

[![install](https://i.imgur.com/miFmofu.png)](https://github.com/skeddles/neopets-sidebar-pets/raw/master/neopets-sidebar-pets.user.js)

![screenshot of the sidebar](https://i.imgur.com/DyCktxK.png)

## Installation

1. Install tampermonkey for [firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) or [chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)

2. Click this link: [https://github.com/skeddles/neopets-sidebar-pets/raw/master/neopets-sidebar-pets.user.js](https://github.com/skeddles/neopets-sidebar-pets/raw/master/neopets-sidebar-pets.user.js)

3. Click install on the page that pops up.

## Usage 

Upon loading any neopets page with a sidebar, it should initialize, and collect the data it needs for the first time, this takes a few seconds. When it's ready, it will display your pets. It will store this information locally so it doesn't have to reload every time, but will refresh every 12 hours. You can also refresh manually by clicking Update Sidebar at the bottom. You can also click the gear to change how often it should refresh. When you change your pets clothes, they wont show in the sidebar until it is refreshed (same with changing your theme).

Note: this grabs data from your userlookup page, so if you have custom HTML it may not be able to find your pets. If you use the same syntax as the default does, you should be safe. Because of this, you could also add in pets from your side accounts if you want to see them in your sidebar.