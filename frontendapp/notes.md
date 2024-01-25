routing 
   - create a new folder that is name of the route and create a file called page.js
   localhost:8080/about     
   - for any nested route use the first point and in that directory create another directory and then the pages.js 
   - use () parenthesis around the naming of the folder if you want to ignore it as a route 

   eg: -(auth)            
         - register
             -page.js 

=> localhost:8000/register   
   we want to go to the register but want to use the auth for folder organization




-Linking    from next/link
     <Link href='' >


- useRouter()    from next/navigation
   like react native to programmably route to another route

   const router = useRouter()

   router.push("")  route segment should in the params

-Dynamic routing : when we have pages that share a common structure but have different data
        STEPS:
        -[]  use a square bracket   to name the folder
        -use the params as a prop to get the dyanmic path on the url 
        - 'use client'


   TYPES OF DYNAMIC ROUTING 
   - CATCH ALL ROUTES 
       would return an array of route segments .. What is a route segment 

    localhost:8000/users/projects/alexander/238923

    {params}  prop would return 
     {
        allRoutes:[
            'users',
            'projects',
            'alexander', 
            '238923',


        ]
     }

    user is a route segment
    projects is a route segment 
    alexander is a route segment 
    238923 is a route segment 


eg: of dyanmic routing(catch all routes) : remember its still get access to the many route segments.. think of catch all routes like an array of route segments and the [...]is destructing it  
    [...allRoutes]   name of folder 



-Not found 

 create a file in the app folder called 
  ****  not-found.js ****   

  nothing but that 




-REDIRECT   from next/navigation






-RENDERING 
      3 TYPES OF RENDERING 
         - Static Rendering
         - Dynamic Rendering 
         - Streaming


BY DEFAULT COMPONENTS IN NEXT JS ARE SERVER COMPONENT .. not for interactivity more for data fetching 


CLIENT COMPONENTS
this one is for interactivity eg: state managment , onClick and frontend event handlers.. rendering is opt-in , meaning you have to explicity decide what components React should render on the client ...you have access browser API
        




- usePathname()   so when we create a route segment we have access to the params prop but what if we want to access that url segment from a normal component or from the layout section or a file that is a route segment we use this hoook from the next/navigation



-generateMetadata()     we can change the metadata for route segment 

**** In page.js of the route segment ***  
    place this code at the bottom 
export const generateMetadata= ()=>{
    return {
        title:"This is a user page", 
        description:"All about the users"

    }
}








***** IMAGE OPTIMIZATION ******
- is it a remote image or local image 
- if remote image perform the right configuration in the next.config file 

- for remote image the if we use the Image component from next the width and right prop are only inferring the width and right but it does not mean that is the actual width and height that would be rendered .. we are doing it to infer the aspect ratio and prevent layout shift
 
 this does not mean you need to provide the default width and height of the image  component
 <Image src ={} width={650} height={366} alt = {} size={} loading ='lazy' priority={}>

Tip: make the width be of (w:h) 16:9 aspect ratio

 -priority prop is a boolean : when priortize an image so it would preload the image so the page load wont be slow

-size  : this prop tells the next js how wide the image should be for different breakpoints .. this is important cause the size of the image is a square of the width...  we use the link below to help us know the right value for this prop .. we book the size and run on our website ..... this means that we have many image source sets .. or image sizes per the screen size 
 https://ausi.github.io/respimagelint/




 for localimages 
 - place them in the public directory 
 - import them like a component but import them from the public 
 - for local images the width and height are not infering aspect ratio necessarily but are the actual width and height of the image 





 *****FONT OPTIMIZATION***
     

