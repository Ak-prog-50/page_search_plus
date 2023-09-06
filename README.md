<div id="top"></div>

<div align="center">
  :diamond_shape_with_a_dot_inside: :diamond_shape_with_a_dot_inside: :diamond_shape_with_a_dot_inside:

  <h2 align="center">Page Search Plus </h3>
  <p align="center">
    Enhanced In-Page Search Functionality...  
    <br />
    <a href="https://youtu.be/GrjOo9k-jH8"><strong>View Demo »</strong></a>
    <br />
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## About The Project

The goal of this project was to build a chrome extension for searching in-page content. My idea was , in chrome and brave browsers the default search dialog could benefit from some additional features such as match whole word.

Basiclaly when a web page loads in the browser, this extension reads the page content and creates a trie and store it in memory. After that when a user wants to search for a word extension uses this trie to suggest auto completions as they type and find the matches.

[View Demo](https://youtu.be/GrjOo9k-jH8)

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- Built With -->

### Built With

I used the typescript boilerplate provided by this github repo for creating the chrome extension. The boilerplate has the neccesary vite configuration and stuff needed to propery run and bundle the extension.

I also used this npm package `trie-search` to create a trie from page content and query it.<br/> 
https://www.npmjs.com/package/trie-search

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- Project Structure -->

### Project Structure

* `extnsion_archived`
    * This is the old codebase I protoyped with. This codebase is written in JS and doesn't use any tools to bundle the extension. I moved from this to new codebase due to unneccesary complexities in bundling extension with this bare-metal approach. Especially when importing npm packages. Also I wanted to get the benefits of using typescript for writing the codebase.
* `extension`
    * `src`
        * `background`
            * This folder contains code for the service worker ( background script ) of the extension. This runs in the background while the extension is active and has 2 main responsiblities.
                1. Creating the trie and storing it in memory. 
                2. Sending suggestions and matches as user type to the extension popup. <br/> https://developer.chrome.com/docs/extensions/mv3/service_workers/
        * `content`
            * Content scripts are the only part that has access to web page that's currently active. Service worker and other scripts run in a isolated environment. 
                1. So this is reponsible for sendign page content to service worker triggering a trie creation. 
                2. And also this handles scrolling to the matched text on web page and highlighting it. <br> https://developer.chrome.com/docs/extensions/mv3/content_scripts/
        * `popup`
            * This folder has the code for creating a react component that will be popped up, when the user clicks on extension. 
                1. This provides the search box for user to type in, and as they type, this will communicate with service worker to get relevant suggestions. 
                2. After getting suggestions, popup wil render a list of matches, which contains a on-click event listener, that will communicate with content script to scroll to the match. This react component's corresponding html file named `popup.html` is at project root.
        * `manifest.ts`
            * The information in this ts file will be used to create a `manifest.json` file when bundling the project using vite configuration. manifest.json is a file that contains info about the extension. <br/> https://developer.chrome.com/docs/extensions/mv3/manifest/


<p align="right">(<a href="#top">back to top</a>)</p>