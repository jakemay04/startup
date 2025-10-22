# CS 260 Notes
THESE ARE MY CS NOTES
[My startup - Simon](https://simon.cs260.click)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS

My IP address is: 54.81.96.130
Launching my AMI I initially put it on a private subnet. Even though it had a public IP address and the security group was right, I wasn't able to connect to it.

## Caddy

No problems worked just like it said in the [instruction](https://github.com/webprogramming260/.github/blob/main/profile/webServers/https/https.md).

## Commandline
chmod: changes access permisions 
pwd: prints current directory
cd: go to a file location
ls: list all current files
ls -la: lists all files, including hidden or long format
vim and nano: text editors in terminal
mkdir: make a new directory
mv: move file
rm: remove
man: help commands
ssh: secure shell
ps: process status
wget: used to download files
sudo: run automatically as admin
domain = banana(subdomain).fruit(subdomain).bozo(root domain).click(top level domain)
HTTPS = must have a web certificate. port 443
HTTP = port 80
SSH = port 22


## HTML

all links in html are
<!DOCTYPE html>
<html>
  <head>
      <title>Page Title</title>
  </head>
  <body>
    <!-- Content goes here -->
      <h1>Main Heading</h1>
      <h2>Sub Heading</h2>
      <h3>Sub-sub Heading</h3>
      <p>This is a paragraph of text.</p>
      <br> <!-- Line break -->
      <ul style="list-style-type:none;">
        <li>Coffee</li>
        <li>Tea</li>
        <li>Milk</li>
      </ul>
  </body>
</html>

div is used to style in css and structure content, but does not inhearently do anything.
Initilize with !DOCTYPE html at top. Must enclose code with <html>
Link css sheet = link rel="stylesheet: href="[filename].css
using Javascript = .script src="[filename.js]  /script
(#title) is used to change the browser title bar
grid is used to create a css grid class
Displaying image with hyperlink = <a href = [url}><img src=[imagefile]></a>


## CSS

How to access ID = # message {text-weight: bold;}
Padding = controls the space within an html element between the content and its border
margin = controls the space around an element
Flex: adjusts the size of the element based on the window size
Default deplay value for span is inline.
CSS box model = content - padding - border - margin


This took a couple hours to get it how I wanted. It was important to make it responsive and Bootstrap helped with that. It looks great on all kinds of screen sizes.

Bootstrap seems a bit like magic. It styles things nicely, but is very opinionated. You either do, or you do not. There doesn't seem to be much in between.

I did like the navbar it made it super easy to build a responsive header.

```html
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand">
            <img src="logo.svg" width="30" height="30" class="d-inline-block align-top" alt="" />
            Calmer
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" href="play.html">Play</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="about.html">About</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="index.html">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
```

I also used SVG to make the icon and logo for the app. This turned out to be a piece of cake.

```html
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#0066aa" rx="10" ry="10" />
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="72" font-family="Arial" fill="white">C</text>
</svg>
```

# JS
How to get something = document.getElementById("[desired ID]").value;
How to get message = document.getElementById("message");
Change content of message = message.textContent = "New message"
Change color of message = message.style.color = 'green'
What is event lisiner = whenever an event is updated, it changes the event
change something onclick = document.getElementById("[id name of button}").onclick = () => {[function]}
DOM (Document object model) = represents page structure as a tree of objects. allows to use JS to interact dinamically with a webpage using objects and their attributes.
JSON (Java Script Object Notation) = is a key:value pair that takes standard data types and is enclosed by {}

promises: 
myPromise.then(
  function(value) { /* code if successful */ },
  function(error) { /* code if some error */ }
);

if (condition) {
  // Code to be executed if the condition is true
} else {
  // Code to be executed if the condition is false
}

for (initialization; condition; final-expression) {
  // Code to be executed in each iteration
}

while (condition) {
  // Code to be executed as long as the condition is true
}

switch (expression) {
  case value1:
    // Code to execute if expression === value1
    break;
  case value2:
    // Code to execute if expression === value2
    break;
  // ... more cases
  default:
    // Code to execute if no case matches the expression
}

// Create an Object
const person = {
  firstName: "John",
  lastName: "Doe",
  age: 50,
  eyeColor: "blue"
};
Yes you can add new properties to objects by doing object.[new prop] = [info]


## React Part 1: Routing

Setting up Vite and React was pretty simple. I had a bit of trouble because of conflicting CSS. This isn't as straight forward as you would find with Svelte or Vue, but I made it work in the end. If there was a ton of CSS it would be a real problem. It sure was nice to have the code structured in a more usable way.

## React Part 2: Reactivity

This was a lot of fun to see it all come together. I had to keep remembering to use React state instead of just manipulating the DOM directly.

Handling the toggling of the checkboxes was particularly interesting.

```jsx
<div className="input-group sound-button-container">
  {calmSoundTypes.map((sound, index) => (
    <div key={index} className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        value={sound}
        id={sound}
        onChange={() => togglePlay(sound)}
        checked={selectedSounds.includes(sound)}
      ></input>
      <label className="form-check-label" htmlFor={sound}>
        {sound}
      </label>
    </div>
  ))}
</div>
```





