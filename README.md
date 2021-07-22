# **CSGO Skinfo**
![CSGO:Skinfo](/wireframes/csgo-skinfo-amiresponsive.PNG "CSGO Skin info website")
*Browse around CSGO Skins*
## **Goal for this project**

If you're a CSGO player then you will know that when it comes to new released skins it's not very easy to find all the information regarding that skin.

CSGO Skinfo will show all the new skins that are released with images so you can see for yourself what the skin is like. There will also be links for that skin which will take you to the steam market. 

So next time there is a new skin release you know where to come.

Thanks for taking a look at my project :) 
If there are any improvements, questions or anything at all then please get in touch.


## Contents 
* User Experience
    * User Goals
    * User Stories
    * Site Owners Goals
    * User Requirements and Expectations
        * Requirements
        * Expectations
    * Design Choices
    * Wireframes & Flow diagrams
## User Experience
---
### **User Goals**

* The website to be responsive on as many possible devices such as Laptops, Tablets, Mobile Phones and PCs.
* I want to have a clear dashboard where the user can create, read, update and delete skins from the website.
* I want to have a clear dashboard which shows skins that have been added, updated or deleted.
* I would like to have the option to add multiple skins.
* The website has to be easy to navigate and easy to update content.
* To be CSGO themed.
* I want to have the latest skins what rarity they're and how it looks.

### **User Stories**

* As a **user**, I would like to be able to register for the website so I can create, read, update and delete skins.
* As a **user**, I want to be able to see my account information.
* As a **user**, I want to be able to see what skins there are for different gun types.
* As a **user**, I want to be able to search for skins.
* As a **user**, I want to be able to see what rarity a skin is.
* As a **user**, I want to be able to navigate and find a skin easily.
* As a **user**, I want to be able to see an image of the skin.
* As a **user**, I want to see if that skin is on the steam marketplace.

### **Site Owners Goals**

* To have a website which feels famillar to CSGO players.
* To have a website which helps users find CSGO skins they're interested in.
* To make a website where it is easy to add content and maintain content.

### **User Requirements and Expectations**
#### Requirements
  * To be able to Add/Update/Remove/Delete Skins.
  * Be responsive across different devices.
  * To be able to contact and be connected.
  * To be able to see the latest new skins.
  * To be able to see the rarity of a skin.
  * To be able to see an image of the skin.
#### Expectations
  * It should be easy to navigate and find the skin you're looking for.
  * To have a dashboard where all the necessary information is shown.
  * It should be easy to add another skin.
  * To be able to filter on rarity of skin.
  * To be able to upvote or downvote a skin.
  * To be able to login.

### **Design Choices**
   I have used CSGO (Counter Strike Global Offensive) custom maps to come up with a colour scheme that creates a CSGO feel. For this website, I want to bring familiarity to CSGO users that it was CSGO themed one thing came to mind as a CSGO player myself this was a Orange and white themed website with dark accents for example a dark background navigation bars with white text with a orange with white boxes background for the body to create the CSGO feel. The reason for this is to bring familiarity as soon as you enter the website.

#### Colours
  I have decided to use colours which bring familiarity from CSGO players but also capture attention of users which aren't familar to CSGO with dark backgrounds with dark accents as when I ran the background colour through [Coolors](https://coolors.co/) color picker to get information for colour blindess, contrast checker and more I discovered that the background colour **#ED7F00** I wanted to use to bring familiarity was not a poor choice for contrast therefore I will use **#212529** backgrounds within a **#ED7F00** background with **EEFFEE** for text this gives a super 14.82 rating within the contrast checker.

  ![CSGO Skinfo Colour Scheme](/wireframes/CSGOSkinfo-colour-scheme.png "CSGO Skinfo Colours")

  * **#ED7F00** with white boxes created with **FFFFFF**.
  * **212529** secondary backgrounds that content sits inside.
  * **EEFFEE** for text within secondary backgrounds.
  * **FFAE51** for hovering over white links.

#### Fonts
  To decide which fonts I want to use I used [dafont](https://www.dafont.com/) to find a font which was similar to the kind of website I wanted something which had game aspects to it I have chose to use [Gameplay](https://www.dafont.com/gameplay.font) for titles, subtitles and links as for body text I chose [Game Over Cre](https://www.dafont.com/game-over-cre.font) as this is similar but also includes lowercase fonts.

#### Structure
  I have decided to use [Bootstrap](https://getbootstrap.com/) so that I can create a structured grid using the Boostrap flexbox column system. It also has useful features such as a card component and alerts.

### **Wireframes & Flow diagrams**
  For building the Wireframes I have used [Balsamiq Wireframes](https://balsamiq.com/) as it allows for easy website Wireframes and easy to get across a general flow of the website.

  Here I will list a few of my wireframes however there are more within the wireframes directory inside this repository:

  #### Home Wireframe Desktop/Tablet & Mobile
  * [Home](wireframes/CSGOSkinfo-Home-Page.png)

  #### Skin Collection Page Desktop/Tablet & Mobile
  * [Pistols](wireframes/CSGOSkinfo-Pistols-Page.png)

  #### Admin Dashboard Page Desktop/Tablet & Mobile
  * [Dashboard](wireframes/CSGOSkinfo-Admin-Dashboard.png)

  ### Flowcharts
  I decided to create a flowchart using [Lucidchart](https://lucid.app/) to document the flow when it comes to signing up/logging in process and also the process for liking and disliking a skin see here:

  #### Signup and logging in process
  * [Flow](wireframes/CSGO_Skinfo-Sign-up-process.png)

  #### Like and dislike skin process
  * [Flow](wireframes/CSGO_SKINFO-LIKE-DISLIKE-FLOW.png)

  ### Database structure
  For this project mongodb has been used to store all relevant data.

  #### **Users**
  Key | Value | 
  --- | --- | 
  __id | ObjectId | 
  first_name | String | 
  last_name | String | 
  email_address | String |
  password | String |
  is_admin | Boolean |
  skins_liked | Array |
  skins_disliked | Array |

  #### **Skins**
  Key | Value | 
  --- | --- | 
  __id | ObjectId | 
  name | String |
  skin_description | String | 
  type | String | 
  weapon_type | String |
  weapon_name | String |
  rarity | String |
  rarity_precedence | Int32 |
  souvenir_available | Boolean |
  stattrak_available | Boolean |
  stattrak_conditions | Object of 5 Booleans |
  conditions | Object of 5 Booleans |
  release_date | Date |
  image_urls | Object of 5 Strings |
  up_votes | Int |
  down_votes | Int |

  #### **Stickers**
  Key | Value | 
  --- | --- | 
  __id | ObjectId | 
  name | String | 
  skin_description | String | 
  type | String |
  rarity | String |
  rarity_precedence | Int32 |
  image_url | String |
  release_date | Date |
  up_votes | Int |
  down_votes | Int |

  #### **Cases**
  Key | Value | 
  --- | --- | 
  __id | ObjectId | 
  name | String | 
  skin_description | String | 
  type | String |
  rarity | String |
  image_url | String |
  release_date | Date |
  up_votes | Int |
  down_votes | Int |

  #### **Gloves**
  Key | Value | 
  --- | --- | 
  __id | ObjectId | 
  name | String | 
  skin_description | String | 
  type | String |
  rarity | String |
  conditions | Object of 5 Booleans |
  release_date | Date |
  image_urls | Object of 5 Strings |
  up_votes | Int |
  down_votes | Int |


  ## Features
  ---
  ### **Live Features**
  * Sign up for an account functionality
  * Sign in and sign out functionality
  * Like and dislike functionality of all skins
  * Paginated pages on pages with more than 20 skins
  * CRUD Functionalities
    * Create - Ability to create a skin and choose different options based upon what you would like to add
    * Read 
      * Ability to search through all skins in the view skins page to see the name, image, description and rarity based upon your search term.
      * Dashboard displays a few analytical pieces on the data from mongodb such as a visual most liked skin slider or still image, number of skins within the db and a few more.
    * Update - Ability to update a skin's details but with validation around certain fields such as conditions as 2 conditions are required at all times for CSGO
    * Delete - Ability to delete a skin through searching for the skin you want to remove and clicking delete and confirm delete in a modal

  ### **Future Features**
  * To change how images are added to a skin as currently you are required to insert a icon url, I would change this so you upload images from wherever.
  * Currently the user signs up and logs in from creating a username and a password with a few extra details I would like to change this so you can signup/login with [Steam](https://steamcommunity.com/) so that it is easy to work. with that users Steam account for future features.
  * Sorting a paginated page by a certain skin field.
  * To have a forget password button on log in page.
  * Have the ability to add collections which are linked to skins so you can show what collections some skins are apart of.
  * To have the search bar across the website accept spaces and other terms to provide better results.
  * To be able to list and buy skins from other users in a marketplace section.

  ## Technologies used
  ---
  ### Coding languages
  * [HTML](https://en.wikipedia.org/wiki/HTML)
  * [CSS](https://en.wikipedia.org/wiki/Cascading_Style_Sheets)
  * [JavaScript](https://en.wikipedia.org/wiki/JavaScript)
  * [Python](https://www.python.org/)

  ### Libraries and Frameworks
  * [Bootstrap5](https://getbootstrap.com/)
  * [Font Awesome](https://fontawesome.com/)
  * [jQuery](https://jquery.com/)
  * [Slick Slider](https://kenwheeler.github.io/slick/)
  * [MC Date Picker](https://www.cssscript.com/mc-datepicker/)

    ### Tools
    * [Git](https://git-scm.com/)
    * [Visual Studio Code](https://code.visualstudio.com/)
    * [Heroku](https://www.heroku.com/)
    * [Balsamiq](https://balsamiq.com/wireframes/)
    * [W3C HTML Validation Service](https://validator.w3.org/)
    * [W3C CSS Validation Service](https://jigsaw.w3.org/css-validator/)
    * [MongoDB](https://www.mongodb.com/)
    * [Flask](https://flask.palletsprojects.com/en/1.1.x/)
    * [PyMongo](https://api.mongodb.com/python/current/tutorial.html)
    * [Jinja](https://jinja.palletsprojects.com/en/2.11.x/)
    * [CSGO Backpack API for Data](http://csgobackpack.net/api/)
    * [Virtual Env](https://docs.python.org/3/library/venv.html)
    

    ## Testing
    ---
    ### **Registration**
    **User Story: As a user, I would like to be able to register for the website so I can create, read, update and delete skins.**
    * **Plan**

      I want to create a page on the website where the user can signup for a personal account which only that user can access. I planned out that I would take the user to there account page once signed up so that they can see that they haven't liked any skins yet this is to help give incentive to liking or disliking a skin. I first planned it out so once they sign up and are redirected that on every page where you can see skins the page would use a find on the database to see what skins they had liked I then found a better way which was to store the skins they liked and disliked inside of a list in the session that way there doesn't need to be a find on every page for the skins they liked and disliked. I also planned out how a user would become an admin so that user could create, read, update and delete there for I wanted a way for a user to request to be admin so I planned for there to a button the user could press to send them to a contact form to request.
    
    * **Implementation**

      I created a form on the /signup page where the user can enter there first name, last name, username, email and then password, I decided to create two password inputs one to confirm there password incase the user accidentally mistypes there password a message is shown if they do not match. I also added some HTML attributes for more validation using the pattern attribute, minlength and maxlength attribute. There is backend validation against username too. Furthermore I increased the security on passwords by adding a pattern attribute to the password input which means that a minimum of eight characters, at least one letter, one number and one special character are required. There is a variable which I created called login to determine whether the user is trying to login or signup this helps differentiate which form to show.

    * **Test**

      To test my signing up proccess I have created accounts more than once when changing backend routes and functions to make sure that the form works perfectly. However there was bugs and issues that I ran into for example incorrect feedback displays at incorrect locations. In addition I also ran into an issue when I decided to change and add keys to the session such as skins liked and skins disliked I initally only added the user's username into the session this meant that when I added and changed this to store multiple key value pairs I needed to update the return redirect to account as the username was the only value stored.

      I also gave access to family to try out the siging up process to see whether there were issues and to see how they found the proccess this helped fix the account bug I mentioned above.

      Adding to that I also tested the request to be admin function for opening a modal and taking the user to the contact page.

    * **Result**

      My Registration proccess is now fully functional and in working order with the pattern attributes helping towards security, I did notice that the standard required input feedback on the pattern attribute wasn't informative therefore I decided to add a text box with the information for the required pattern. Fixing the account redirect bug means that the users details are safely stored into the users collection inside my csgo-skinfo db and they are correctly redirected to there account page. I have made sure that the form is responsive across different browsers and devices by using my mobile phone, chrome dev tools for different screen sizes and different browsers. I made the request to be admin button redirect to the contact page as this makes more sense as it is an enquiry.

    * **Verdict**

      The test is complete and it works as I planned.

    ### **Signing In**
    **User Story: As a **user**, I want to be able to see my account information.**

    * **Plan**
    
      My plan for a user to see/access there account information was to create a login form which sets a session cookie that holds user information such as there username, if they're an admin or not, skins liked and also skins disliked this way this information is easily accessible across the site without reusing variables. After the user is to login the user will be redirected to there account page that displays account information such as skins liked, skins disliked and the users username. My plan is to also show and hide links within the website based upon the users admin status or not.
    
    * **Implementation**

      I created a login form which asks for the username and password which is validated by HTML input attributes and backend validation which checks my users collection to see if that user exists and if it does then does the password match the user in the db password. Feedback is provided by a message to display the neccessary information to the user. The user can navigate between sign in and signup with a link that I provided above the form. The user is redirected to there account page once the form submitted is validated successfully.

    * **Test**
      The login form when information is incorrectly inputted the correct message for the reason is displayed.

      The login form when information is correctly inputted the correct message is also shown but on there account page after the redirect is made.
    
    * **Result**
      Overall the login functionality works as intended and works well with the current signup system the form is being validated correctly and the correct messages are shown with the account redirect also working in full order.

    * **Verdict**
      The test is complete and it works as I planned.

    ### **View Skin Types**
    **User Story: As a **user**, I want to be able to see what skins there are for different gun types.**

    * **Plan**

      The user should be able to navigate the site by weapon type / skin types and see what skins there are for them. To give the user visualisation of the gun types and what skins them guns have I want to display an image of the best version of that skin. 
      The user should be able to see a list of all skins within that gun type.

    * **Implementation**

      I created all gun/skin type links within the nav bar both for desktop and mobile which allows the user to breakdown by gun type or skin type for example whether it's a Rifle or Knife or even Sniper Rifle the links in the nav bar provide a clear visual sign of what weapons/skins are inside that page. There is also a search bar navigation option which allows the user to search for a skin by name there are improvements that could be made to this however by increasing functionality to accept spaces and other characters this will be implemented later on.

      To display the images of the skins with the best version of that skin I decided the best way to achieve it was through a URL this is because I don't have the knowledge or skils to be able to implement an uploading skin option to the admin area, so the way I display skins is by taking the skins name and prefixing it with the steam image URL and by asking for all images for that condition.

      When navigating to a gun type page I load the page with skins sorted by rarity so that the highest rarity skins are shown first I also added pagination at the bottom of the page so you can click through all the skins for that gun type.
    
    * **Test**

      I have tested the navigation links and tested which gun types are pulling into those specific pages to make sure all pages show the correct gun types/skins.

      I have also tested adding a paginated sort feature which I decided to add to [Future Features](#future-features) this is because I don't have the required knowledge and skills to implement this feature perfectly.

      I have tested the pagination buttons by going through multiple links and checking that the skins appear correclty and no errors are shown.

      I did notice through testing on mobile that because of number of skins within some pages on mobile it created a frustrating scenario where you scroll down the page very far and if you want to go back up to the top you have to scroll alot therefore I decided to add a back to top button which appears when you scroll past a certain point. I also made sure through testing that on mobile it wasn't conflicting or blocking any content.

    * **Result**

      Navigating to a gun type page correctly displays the correct guns and also clearly see what guns and skins there are by looking at the images and names of the skin.

      Pressing back to top button works in order and scrolls you back to the top on click and hides when at the top and doesn't construct or block content.

      Scrolling to the bottom of the page shows the other page links to paginate the skins pressing a link takes you to that page of skins correctly.

    * **Verdict**

      The test has passed and works like planned.

    ### **Searching Skins**
    **User Story: As a **user**, I want to be able to search for skins.**

    * **Plan**

      When planning the search functionality I first thought it would be good way to help find the skins if an admin **user** wanted to read, edit or delete a skin to implement searches so they could pick the skin that they either want to read, edit or delete I then thought it would come in handy to have the read functionality site wide with a search that any user could use.

      Therefore the user should be able to search for skins and then be presented results from that search which was perfomed they then should be able to view that specific skin by selecting it.

    * **Implementation**

      I first created a search input form for admins where a user can search by the name of the skin to find what they're looking for and then read, update or delete that skin depending on the area they search this allows for me to prefil information on edit forms and visually display to the user what the skin looks like. 

      To return accurate results I used a regular expression with the mongodb find method in order to drill down results the search results are returned from a function which renders templates based upon the request arguments and then checks to see if there is a value for that argument **searchallskins** name attribute on a form element returns all skins dependening on the search term.
    
      There are multiple search inputs in the admin area so the user knows exactly what results will show up within the search they perform I also implemented the search into the nav bar on the whole site so any user can search for a partciular skin.
    
    * **Test**

      When testing the search functionality there was a few bugs that I ran into when trying to return the correct results from my database for example searching for nothing would return in an missing key error as I have a condition which checks the request values which takes a key to access the value this would not return anything as no value had been specified within the search I managed this by adding required attributes onto the search inputs so that something has to be entered before you can press search.

      With testing the search I noticed that as I was rerendering templates that a page title variable which I passed was no longer being passed so I re-added these into the rerendering.

      Other testing also made me aware of the limitations my regex search currently offers with the results which are shown back after a search this is something I would like to improve on but don't currently have that much knowledge on regular expressions.

    * **Result**
      
      Searching by skin name is in 3 separate locations within the website 1. is in the nav bar which attempts to return all skins in my database and the other two are in the admin area 5 search inputs for editing skins and 1 search input for finding the skin you want to delete. 

      Overall the search works well but could be improved with a better regular expression.

    * **Verdict**
      The test has passed and works in a manor, however could be improved with better regular expression.

  ### **Rarity**
  **User Story: As a **user**, I want to be able to see what rarity a skin is.**

    * **Plan**
      
      The user has to be able to see what rarity the gun/knife/gloves/ or sticker rarity that skin is and be given a visual identification on what colour that rarity is. It is also important that the user when viewing, editing, creating or deleting what the rarity colour or rarity options are for that particular skin as Stickers have slightly different rarity names than other skins this is important to users who aren't famillar with CSGO so that they can go off colours rather than rarity names.
    
  * **Implementation**

    For this visual identification I decided to add background colours for the specific skins so Covert is #eb4b4b but also the name of the rarity is also shown. I also decided that users would like to see the highest rarity skins first over the lower rarity therefore I created a int32 field on skin types that have more than one rarity called "rarity_precedence" this helps to sort skins by rarity and makes sorting by a specific rarity if needed easy.

  * **Test**

    I have tested the rarity showing on all pages that require it such as skin pages, add skin, edit skin, view skins, liked and disliked skins within the account page.

    I did have one issue with rarities being different between weapons and gloves as on the add skin page where you select which rarity a weapon has a rarity which is only possible for Gloves was pulling in from the collection I managed this by adding a ecluding condition for the rarity select options.

  * **Result**

    The rarity and rarity precedence works well so I can show the user the exact rarity of that specific skin.

    It also works well within the select options for editing and adding as I add the rarity as a class on the options and have CSS which colours the text of those options so you can also visually see what rarities there are.

  * **Verdict**

    The test is complete and it works as I planned.

  ### **Skin Images**
  **User Story: **As a **user**, I want to be able to see an image of the skin.**

  * **Plan**

    When planning on adding the skin images to the website I decided to look for API's to pull the image url from it and use it as there are so many skins I thought it would be easier to get from an API.

    I also wanted to show the images next to other information about that skin to help give identity to that skin and to also make it feel like there's lots of information about the skin and to entice the user to either press like or disliked.

    In addition I would also like the user to be able to view images of there liked and disliked skins and also images inside search results, on that exact skin page and more as it helps confirm to that user what they're viewing or editing.

  * **Implementation**

    When implementing I decided to use a CSGO skin API to grab the icon urls so that I could prefix them with the right domain to pull the images into my database once I had the image urls within the database I had to structure code around 2 different types of skin types as Cases and Stickers share only having one image within the API and then Guns, knifes and gloves have a few based upon the weapon skin criteria therefore images are pulled in surrounding conditions around the type of skin that it is I attempt to show the highest/least scratched skin first starting with Factory New down to Battle Scarred. Images are shown an most pages across the website.
  
  * **Test**
  
    When testing I made sure that all skins had an image or all skins where I could get the image from the API if there isn't an image in my database I created a placeholder image which can be shown instead. I came into lots of issues when trying to add images to my website this is because of the way the API I used handled data of the same skin but a different condition I had issues on Sticker and case images where the standard icon url was too small therefore I had to reinject data into my database but using the large icon url if it wasn't null.

    There was also issues with gun conditions and cases and stickers this is because guns have multiple image urls where has cases and stickers only have one I had issues when testing that because they had diffent fields key errors became prominent this was fixed by adding conditions and passing skin type as a variable in the route.

  * **Result**

    All skins now display an image and the image urls are sat within a object that has factory new, minimal wear, field tested, well worn and battle scarred even just one image url if it's a sticker or case.

    Images are displayed on all pages where needed.

  * **Verdict**
    The test has passed all the criteria.


  ### **Steam URLs**
  **User Story: As a **user**, I want to see if that skin is on the steam marketplace.**

  * **Plan**
    When planning on how I would get the skin Steam url I decided to take a look at the urls within the community market that is hosted by Steam I noticed a similarity between all CSGO skins that all market URL's have a domain prefix such as: https://steamcommunity.com/market/listings/730/ and then following the last / the name of the skin but URL encoded this helped me to plan how I would incorporate the steam URL.

  * **Implementation**
    
    When implementing the steam URLs there was a few variables that i had to take into account such as whether the skin is a gun, knife, glove, sticker or case. As those 5 skin types have different naming conventions but also with guns and knifes there are StatRak options this meant that I had to had conditions to check if the condition is StatTrak and also if the skin that you are on is a knife or not as knifes and gloves have a ★ icon before them this means that to get the correct url this icon needs to be inside the url for knfies and gloves.

    So with conditions and Jinja string filters I append the conditions I store inside my database to a longer string which is prefixed with the Steam url domain.
  
* **Tests**

  When testing these options and steam urls I ran into errors and missing image links this was due to formatting with either an icon inside the url or something else maybe symbol related for example when trying to link to the factory new version of a gun skin it needs to include the condition inside the URL which follows this exact match: (Factory New) this meant that I could not just fill a string in with the condition that I store in my databases so I had to use the replace method to remove underscores with spaces and to make the whole string capitialized using the title method.

  Once I added conditions to give me the correct URL all links worked perfectly.

* **Result**

  All gun skins and knifes now have links to the correct condition on the skin page.

* **Verdict**

  The test has passed for gun skins and knife skins but doesn't for gloves, cases and stickers.

## **Bugs**

### **Like Dislike Bug**

* **Bug**

 *  When the user would login to like and dislike a skin the    POST requests to update the up votes wouldn't correlate to the amount of times liked, it would also not show on the frontend correctly until refresh. 
  * I also came into the issue that even on page refresh the skin wouldn't show as liked this was because of how I show the like and dislike buttons actively liked based on the session cookie

* **Fix**
  * Updated the values sent to backend from the frontend post request
  * Using the find_one method helped so that I got returned a value rather cursor object this meant I could access the skins up votes and down votes without having to loop through the cursor.

  * I fixed the like and dislike buttons from not showing the right state by resetting the session cookie when a user clicks like or dislike a POST request is made to a route in my app which returns a string but when a request is made it adds that skin they liked or disliked into the session cookie and databases this way when the page is refreshed the cookie is up to date with the skin they just liked.

* **Verdict**
  Like and dislike buttons now work as intentional and update both backend and front end correctly there is a clear indication the skin has been liked and also shows you the correct ammount front as soon as you like.

### **Updating Selected Skin Bug**

* **Bug**

  When trying to update the currently selected skin I attempted to make the request to the backend through Javascript I made a fetch request which formatted all the data from the fields and then was going to then update that selected skin in mongodb the bug I came into was although I was sending a POST request and although print statements where printing for whatever reason it wouldn't allow me to redirect the user this was even with trying things such as allow redirects on the form and with redirect url for and render templates none of them would work when I was posting the request through JS.
    
  
* **Fix**

   I thought it may of been to do with event preventDefault so I decided to alter the edit selected skin form and to remove the fetch request and put it on the form it's self so now there is an action method which use url_for to define where to send the data to and that way the redirect from the backend works when there is a POST request it also allowed me to create a flash message.

* **Verdict**
  
  Bug fixed and edit skin now working as intended.


### **Date Picker Bug**

* **Bug**

  When trying to add a skin as some fields aren't made required through native HTML and they were made required by my custom jQuery when you tried to submit a form it would bring the date picker up before you had selected a checkbox or two. I also had issues with iniatlizing the JS as I have multiple forms that use the date picker so I tried to use it in my global script file and I got date picker undefined.
    
  
* **Fix**

   I fixed this by removing the fetch to add a skin and changing the action into the form attribute and then also adding conditions around when to make the date picker required so that the date picker doesn't pop up before it's needed to popup.

* **Verdict**
  
  Bug fixed and date picker works as intended on edit skin and add skin.

### Local Deployment / Development

I have created CSGO:SKINFO project using Github, from there I used [Visual Studio Code](https://code.visualstudio.com/) to write my code using custom packages to help me code. 
Then I used commits to git followed by "git push" to my GitHub repository. 
I deployed this project to Heroku by using "git push heroku" to make sure my pushes to GitHub were also made to Heroku.
I also attached automated developments through connecting my GitHub repository to heroku.

This project can be ran locally by following the following steps: (
Make sure to create a virtual environment activate the virtual environment and then use pip3 install -r requirements.txt to install dependencies.
You can find more information about installing packages using pip and virtual environments [here](https://code.visualstudio.com/docs/python/environments)

To clone the project: 

1. From the application's repository, click the "code" button and download the zip of the repository.
    Alternatively, you can clone the repository using the following line in your terminal:

    ``` 
    git clone https://github.com/bradleyplaydon/CSGOSkinfo.git
    ``` 

1. Access the cloned folder in your terminal/command prompt and install the application's [Dependencies](https://github.com/bradleyplaydon/CSGOSkinfo/blob/master/requirements.txt) using the following command:

    ```
    pip3 install -r requirements.txt
    ```

1. Sign-in or sign-up to [MongoDB](https://www.mongodb.com/) and create a new cluster
    * Within the Sandbox, click the collections button and after click Create Database (Add My Own Data) called csgo_skinfo
    * Set up the following collections: users, stickers, skins, cases
    * The image_urls, conditions, stattrak_conditions consist of factory_new, min_wear, field_tested, well_worn, battle_scarred
    * The **skins** collection is setup with the following structure; the rest of the collections follow same format but some have missing fields [See the Database Structure](#database-structure): 
        ```
        __id | ObjectId | 
        name | String |
        skin_description | String | 
        type | String | 
        weapon_type | String |
        weapon_name | String |
        rarity | String |
        rarity_precedence | Int32 |
        souvenir_available | Boolean |
        stattrak_available | Boolean |
        stattrak_conditions | Object |
        conditions | Object |
        release_date | Date |
        image_urls | Object |
        up_votes | Int |
        down_votes | Int | 
        ```

    * Under the Security Menu on the left, select Database Access.
    * Add a new database user, and keep the credentials secure
    * Within the Network Access option, add IP Address 0.0.0.0

1. In your Code Editor, create a file containing your environmental variables called env.py at the root level of the application. 
    It will need to contain the following lines and variables:
    ```
    import os

    os.environ["IP"] = "0.0.0.0"
    os.environ["PORT"] = "5000"
    os.environ["SECRET_KEY"] = "YOUR_SECRET_KEY"
    os.environ["DEBUG"] = "True"
    os.environ["MONGO_URI"] = "YOUR_MONGODB_URI"
    os.environ["MONGO_DBNAME"]= "DATABASE_NAME" 
    ```

    Please note that you will need to update the **SECRET_KEY** with your own secret key, as well as the **MONGO_URI** and **MONGO_DBNAME** variables with those provided by MongoDB.
    Tip for your SECRET_KEY, you can use a [Password Generator](https://passwordsgenerator.net/) in order to have a secure secret key. 
    I personlly recommend a length of 24 characters and exclude Symbols.
    To find your MONGO_URI, go to your clusters and click on connect. Choose connect your application and copy the link provided. 
    Don't forget to update the necessary fields like password and database name. 

    If you plan on pushing this application to a public repository, ensure that env.py is added to your .gitignore file.

1. The application can now be run locally. In your terminal, type the following command 
    ```
    python3 app.py. 
    ```
    
### To deploy your project on Heroku, use the following steps: 

1. Login to your Heroku account and create a new app. Choose your region. 
1. Ensure the Procfile and requirements.txt files exist are present and updated in your local repository.  
    Requirements:
    ```
    pip3 freeze --local > requirements.txt
    ```
    Procfile:
    ```
    echo web: python app.py > Procfile
    ```
1. The Procfile should contain the following line:
    ```
    web: python app.py
    ```

1. Scroll down to "deployment method"-section. Choose "Github" for automatic deployment.
1. From the inputs below, make sure your github user is selected, and then enter the name for your repo. Click "search". When it finds the repo, click the "connect" button.
1. Scroll back up and click "settings". Scroll down and click "Reveal config vars". Set up the same variables as in your env.py (IP, PORT, SECRET_KEY, MONGO_URI and MONGODB_NAME):
    !You shouldn't set the DEBUG variable in under config vars, only in your env.py to prevent DEBUG being active on live website. 

    ```
    IP = 0.0.0.0
    PORT = 5000
    SECRET_KEY = YOUR_SECRET_KEY
    MONGO_URI = YOUR_MONGODB_URI
    MONGO_DBNAME = DATABASE_NAME
    ```

1. Scroll back up and click "Deploy". Scroll down and click "Enable automatic deployment".
1. Just beneath, click "Deploy branch". Heroku will now start building the app. When the build is complete, click "view app" to open it.
1. In order to commit your changes to the branch, use git push to push your changes. 
    
