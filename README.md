# **CSGO Skinfo**

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
    * To have a search bar across the website so you can search for skins easily.
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
