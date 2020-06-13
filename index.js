
/* Part 1 */

const puppeteer = require('puppeteer');
const urls=[
    'https://www.tripadvisor.com/Restaurant_Review-g295413-d9784331-Reviews-Monal_Lahore-Lahore_Punjab_Province.html',
    'https://www.tripadvisor.com/Restaurant_Review-g295413-d9784331-Reviews-or10-Monal_Lahore-Lahore_Punjab_Province.html',
    'https://www.tripadvisor.com/Restaurant_Review-g295413-d9784331-Reviews-or20-Monal_Lahore-Lahore_Punjab_Province.html',
    'https://www.tripadvisor.com/Restaurant_Review-g295413-d9784331-Reviews-or30-Monal_Lahore-Lahore_Punjab_Province.html',
    'https://www.tripadvisor.com/Restaurant_Review-g295413-d9784331-Reviews-or40-Monal_Lahore-Lahore_Punjab_Province.html',
    'https://www.tripadvisor.com/Restaurant_Review-g295413-d9784331-Reviews-or50-Monal_Lahore-Lahore_Punjab_Province.html',
    'https://www.tripadvisor.com/Restaurant_Review-g295413-d9784331-Reviews-or60-Monal_Lahore-Lahore_Punjab_Province.html',
    'https://www.tripadvisor.com/Restaurant_Review-g295413-d9784331-Reviews-or70-Monal_Lahore-Lahore_Punjab_Province.html',
    'https://www.tripadvisor.com/Restaurant_Review-g295413-d9784331-Reviews-or80-Monal_Lahore-Lahore_Punjab_Province.html',
    'https://www.tripadvisor.com/Restaurant_Review-g295413-d9784331-Reviews-or90-Monal_Lahore-Lahore_Punjab_Province.html'


]

puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080'] }).then(async browser => {
   
    for(let i=0; i<urls.length; i++){

        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request',(request)=>{
            if(request.resourceType()=='image' || request.resourceType()=='stylesheet'){
                request.abort();
            }
            else{
                request.continue();
            }
        })
        const url=urls[i];
        await page.setDefaultNavigationTimeout(0);
        await page.goto(`${url}`);

        console.log(`${url} Opened`);
        await page.waitForSelector('body');

        /* Part 2 */
        //wait page.waitForSelector('.taLnk.ulBlueLinks');
       await page.click('.taLnk.ulBlueLinks');
        await page.waitForFunction('document.querySelector("body").innerText.includes("Show less")');
      
        
        /* Part 3 */
        
        var reviews = await page.evaluate(() => {
               
                var results = [];
        
                var items = document.body.querySelectorAll('.review-container');
                items.forEach((item) => {
                    
                    /* Get and format Rating */
                    let ratingElement = item.querySelector('.ui_bubble_rating').getAttribute('class');
                    let integer = ratingElement.replace(/[^0-10]/g,'');
                    let parsedRating = parseInt(integer) / 10;
        
                    /* Get and format date of Visit */
                    let dateOfVisitElement = item.querySelector('.prw_rup.prw_reviews_stay_date_hsx').innerText;
                    let parsedDateOfVisit = dateOfVisitElement.replace('Date of visit:', '').trim();
        
        /* Part 4 */
        
                    results.push({
                            rating: parsedRating,
                            dateOfVisit: parsedDateOfVisit,
                            ratingDate: item.querySelector('.ratingDate').getAttribute('title'),
                            title:  item.querySelector('.noQuotes').innerText,
                            content: item.querySelector('.partial_entry').innerText,
                        
                    });
                    
                });
                return results;
            });
        
            console.log(reviews);    

    }
 
       
    await browser.close();

}).catch(function(error) {
    console.error(error);
});