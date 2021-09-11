Important Note About NPM Packages and The Zip Files in This Course
Hello everyone,

In the previous lesson we installed packages from NPM using the command-line. The creators of packages are constantly releasing new versions and this can create a situation where the code works for me in the video lesson, and if you had a time machine to travel back to the day I recorded the video your code would work too, but because you’re living in the present moment using different package versions there’s a conflict. This can be very frustrating and I want to help you avoid this situation.

I recommend you:

Download the package.json file from this article and place it in your project folder so that it replaces your existing package.json file.

Delete your existing package-lock.json file.

Delete the entire node_modules folder in your project,

Finally, in the command line type npm install

This will install all of the packages we’ll need throughout the entire course; with that in mind it will take a good minute or two. This does two wonderful things for you:

You can rest assured that you’re using the same version number of packages that I used (and/or have tested)

You don’t need to follow along with all of the “npm install” commands throughout the course - you already have all the necessary packages installed.

If you’ve completed the course and are circling back to this article, you’ll be interested in the file named package-end-of-course.json (download it and rename it to just package.json) which has the “scripts” area completed with all of our different “npm run” commands.

A Note About Zip Files In This Course
I have purposely not included the package.json file in the reference zip found with each lesson. If you want to use the reference code in the zip for a lesson, please circle back to this article and use the package.json file found here in combination with the contents of the zip file. This way, I can keep this single copy of package.json updated and make sure it works with our course code (instead of me updating 60+ copies of the package.json file).

Thanks!
Brad

Resources for this lecture
