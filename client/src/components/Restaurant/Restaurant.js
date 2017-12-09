import React, { Component } from 'react';
import Reviews4andMore from './Reviews4andMore/Reviews4andMore';
import Articles4andMore from './Articles4andMore/Articles4andMore'
import PhotosandMore from './PhotosandMore/PhotosandMore'
import Reviews from './Reviews/Reviews'
import HeaderForPopup from '../Header/HeaderForPopup'
import Menus from './Menus/Menus'
import Friends from './Friends/Friends'
import SaveRestaurant from './SaveRestaurant/SaveRestaurant'

import CountDown from '../Helpers/CountDown'
import Summary from './Summary/Summary'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

class Restaurant extends Component {
  loading = true;
  constructor(props) {
    super(props);
    this.state = {
      restaurant: {}

    }
  }

  componentDidMount() {
    let fakedata = true;
    if (fakedata) {
      this.setState(this.getStateObject(restaurant));

    }
    else {
      fetch('/api/reviews?name=' + this.props.name)
        .then(res =>
          res.json())
        .then(restaurant => {
          this.setState(this.getStateObject(restaurant));
        });

    }


  }

  getCalculatedData = function (restaurant) {
    let total_number_of_reviews = 0;
    let total_rating = 0;
    let sum_rating = 0;
    let contributers_per_platform = [];
    let contributers_per_review = [];
    let articles_contributers = [];
    restaurant.reviews.forEach(function (element) {
      try {
        if (element.rating && element.number_of_reviews && element.number_of_reviews != "N/A") {
          total_number_of_reviews = total_number_of_reviews + element.number_of_reviews * 1;
          total_rating = total_rating + element.number_of_reviews * element.rating;
          contributers_per_review.push(element.source);
        }
        if (element.rating && element.rating <= 5 && element.rating > 0) {
          sum_rating = sum_rating + element.rating * 1;
          contributers_per_platform.push(element.source);
        }
      }
      catch (e) {
        console.log("cannot calculate average rating for error:" + e.message + e.stack)
      }
      if (element.review_article) {
        articles_contributers.push(element.source);
      }
    });
    let retVal = {};
    retVal.rating = {};
    retVal.rating.per_review = {};
    if (total_rating > 0 && total_number_of_reviews > 0) {
      retVal.rating.per_review.rating = total_rating / total_number_of_reviews;
      retVal.rating.per_review.number_of_reviews = total_number_of_reviews;
      retVal.rating.per_review.contributers = contributers_per_review;
    }
    retVal.rating.per_platform = {};
    if (sum_rating > 0) {
      retVal.rating.per_platform.rating = sum_rating / contributers_per_platform.length;
      retVal.rating.per_platform.number_of_reviews = contributers_per_platform.length;
      retVal.rating.per_platform.contributers = contributers_per_platform;
    }
    retVal.articles = {};
    if (articles_contributers.length > 0) {
      retVal.articles.contributers = articles_contributers;
    }
    return retVal;
  }

  getStateObject = function (restaurant) {
    let reviews_with_reviews = [];
    let reviews = [];
    let articles = [];
    let photos = [];
    let menus = [];
    let review_friends = [];
    let id_counter = 0;
    restaurant.reviews.forEach(function (element) {
      id_counter++;
      element.inner_id = id_counter;
      if (element.review_article) {
        id_counter++;
        element.review_article.inner_id = id_counter;
        articles.push(element);
      }
      else if (element.review_friends) {
        id_counter++;
        element.review_friends.inner_id = id_counter;
        review_friends.push(element);
      }
      else if (element.photos) {
        id_counter++;
        element.photos.inner_id = id_counter;
        photos.push(element);
      }
      else if (element.menu) {
        id_counter++;
        element.menu.inner_id = id_counter;
        menus.push(element);
      }
      else {
        let has_reviews = false;
        element.reviews.forEach(function (review) {
          id_counter++;
          review.inner_id = id_counter;
          has_reviews = true;
        })
        if (has_reviews) {
          reviews_with_reviews.push(element);
        }
        else {
          reviews.push(element);
        }
      }
    });

    let calculated_data = this.getCalculatedData(restaurant);
    calculated_data.articles.sum = articles.length;
    calculated_data.photos = { sum: photos.length };
    calculated_data.menus = { sum: menus.length };

    return {
      restaurant: restaurant,
      calculated_data: calculated_data,
      reviews: reviews_with_reviews.concat(reviews),
      articles: articles,
      photos: photos,
      friends: review_friends,
      menus: menus
    };
  }



  render() {
    let restaurantName = <div><p>Loading restaurant information... </p><CountDown /></div>;
    if (this.state.restaurant.metadata) {
      restaurantName =
        <nav class="navbar navbar-inverse navbar-fixed-top">
          {this.state.restaurant.metadata.name}
          <ul class="nav navbar-nav">
            <li><a href="#section1">Reviews</a></li>
          </ul>
          <ul class="nav navbar-nav">
            <li><a href="#section2">Articles</a></li>
          </ul>
          <ul class="nav navbar-nav">
            <li><a href="#section3">Photos</a></li>
          </ul>
          <ul class="nav navbar-nav">
            <li><a href="#section4">Friends</a></li>
          </ul>
          <ul class="nav navbar-nav">
            <li><a href="#section5">Menu</a></li>
          </ul>
          <ul class="nav navbar-nav">
            <li><a href="/myplaces">My Restaurants</a></li>
          </ul>
        </nav>


      //  <HeaderForPopup name={this.state.restaurant.metadata.name} url={this.state.restaurant.metadata.website} />;
    }
    let friends = <p>Loading friends infirmation... </p>
    if (this.state.reviews) {
      friends = <Friends friends={this.state.friends} />
    }
    let save_restaurant = <p>Loading profile... </p>
    if (this.state.reviews) {
      save_restaurant = <SaveRestaurant restaurant={this.state.restaurant.metadata} />
    }

    let reviews4andMore = <p>Loading reviews... </p>
    if (this.state.reviews) {

      reviews4andMore = <Reviews4andMore reviews={this.state.reviews} />
    }
    let articles4andMore = <p>Loading articles... </p>;
    if (this.state.articles) {
      articles4andMore = <Articles4andMore articles={this.state.articles} />
    }
    let photosandMore = <p>Loading photos... </p>;
    if (this.state.photos) {
      photosandMore = <PhotosandMore photos={this.state.photos} />
    }
    let menus = <p>Loading menus... </p>;
    if (this.state.menus) {
      menus = <Menus menus={this.state.menus} />
    }

    let summary = <Summary data={this.state.calculated_data} />;

    return (
      <div className="popup">
        <div className="restaurant">
          {restaurantName}
          {save_restaurant}
          <Route path="/restaurant/:name" render={({ match }) => (
            <div id="section1">
              {reviews4andMore}
            </div>
          )} />
          <Route path="/restaurant/:name" render={({ match }) => (
            <div id="section2">
              {articles4andMore}
            </div>
          )} />
          <Route path="/restaurant/:name" render={({ match }) => (
            <div id="section3">
              {photosandMore}
            </div>
          )} />
          <Route path="/restaurant/:name" render={({ match }) => (
            <div id="section4">
              {friends}
            </div>

          )} />
          <Route path="/restaurant/:name" render={({ match }) => (
            <div id="section5">
              {menus}
            </div>

          )} />

        </div>
      </div>
    );
  }
}

export default Restaurant;




var restaurant = { "metadata": { "google_id": "ChIJ-4xJz7AcdkgRt0jZLI7DAEU", "address": "56A Shoreditch High St, London E1 6PQ, UK", "name": "Pizza East", "phone_number": "020 7729 1888", "area_near": "56A Shoreditch High Street, London", "description": "Pizza East, Shoreditch High Street, London, United Kingdom", "website": "http://www.pizzaeast.com/", "location": { "lat": 51.5238239, "lng": -0.07689069999999999 }, "facebook_name": "Pizza East", "contant": { "phone": "+442077291888", "formattedPhone": "+44 20 7729 1888", "twitter": "pizzaeast", "instagram": "pizzaeast", "facebook": "106185806127716", "facebookUsername": "pizzaeast", "facebookName": "Pizza East" } }, "reviews": [{ "rating": 4.1, "number_of_reviews": "N/A", "source": "google", "reviews": [{ "rating": 5, "time": "a month ago", "text": "We visited mid week at around 7pm. Wine was delicious. The food was on point and arrived within good time. A little crowded in the evening, but the vibe was good. Prices were reasonable for the fresh quality of food." }, { "rating": 4, "time": "in the last week", "text": "There are lots of pizza joints out there these days, and this is one of the better ones.  I love the big, industrial space the restaurant sits in.  The pizza itself is as it should be - crispy, thin crusts, with savoury toppings including more exotic cheeses & meats -- beyond the usual goats cheese or mozzarella and pepperoni or parma ham.  Recommended venue for big tables as well - I had a table of 8 and the service was spot on." }, { "rating": 5, "time": "3 weeks ago", "text": "Great pizzas for a decent price. The vibe is really good too, very casual. I was vegan and the time and was able to easily choose from various options. Also, they serve their red wine in a tumbler, which I love." }, { "rating": 5, "time": "in the last week", "text": "We arrived around 7pm and had a couple beers outside in a food fair. After entering the atmosphere was great and the food and service very good. The prices are fair. A great place to go with a group of friends." }, { "rating": 1, "time": "4 months ago", "text": "Having been a regular customer at Pizza East since it opened, I feel obliged to write a review. As it really has upset me that both the service and the management last Monday were a huge disappointment. Working around the corner, Pizza East has been the base for many meetings, staff training and celebrations. Therefore, when a close friend was leaving the country for good, we thought Pizza East would make the perfect send-off location. We couldnâ€™t have been more wrong. Firstly, the waitress had terrible attitude, unapproachable and considering we were a group of adults celebrating she was not the person to be our host. Secondly, we specifically chose to dine on a Monday at Pizza East to receive the 50% off, using the Pizza East keyring. However, because we were a group of 9 rather than a group of 8 they would not honour that, even though we never knew this was an issue. You would assume that management would be able to make an executive decision and keep 9 happy customers, rather than having a black cloud of dissatisfaction post meal. Otherwise, we would have made a booking on another day of the week outside of the discount day. However, now we know not to return to Pizza East, as there is no customer loyalty in this restaurant or any form of understanding. Which has forced me to write a review, as I feel it is necessary for them to understand that having a customer who has been to your restaurant for years, is shocked by the service and communication we received on Monday. Luckily Pizza Pilgrims has opened seconds down the road." }] }, { "rating": 4.4, "number_of_reviews": 509, "source": "facebook", "facebook_id": "1813879718845438", "reviews": [] }, { "rating": 4.4, "number_of_reviews": 509, "source": "facebook", "facebook_id": "1813879718845438", "reviews": [], "review_friends": { "link": "https://www.facebook.com/pg/1813879718845438/community/?ref=page_internal" } }, { "source": "instagram", "instagram_id": "1813879718845438", "reviews": [], "photos": { "url": "https://www.instagram.com/explore/locations/1813879718845438/", "text": "foto by guests on" } }, { "rating": "N/A", "number_of_reviews": "N/A", "source": "foursquare", "foursquare_id": "4ad75c2df964a520cd0921e3", "menu": { "url": "https://foursquare.com/v/4ad75c2df964a520cd0921e3/device_menu" } }, { "rating": "N/A", "number_of_reviews": "N/A", "source": "foursquare", "foursquare_id": "4ad75c2df964a520cd0921e3", "photos": { "photos": [{ "url": "https://igx.4sqi.net/img/general/height250/3210540_cx-S86f48XZI_zn-202bhTdyzBmT2NUequSm028vwwY.jpg" }, { "url": "https://igx.4sqi.net/img/general/height250/19129447_Mhe-ZGovL3kFh5HoMKclj2giznbvKVrY8jBymvPw7F8.jpg" }, { "url": "https://igx.4sqi.net/img/general/height250/89121_wPHmQP_TW1Y52xeGdyGpI4-zbdEBJbMQr_6MfKihbvU.jpg" }, { "url": "https://igx.4sqi.net/img/general/height250/52214017_o9poev8bZAIryUCvPBwvYHyckhmfRup2RUra20c1LlM.jpg" }, { "url": "https://igx.4sqi.net/img/general/height250/42082284_C6eEquZVzmbhD2vP9sxbaVFXMj8O3ITpfN2eUTifo3g.jpg" }, { "url": "https://igx.4sqi.net/img/general/height250/61119138_eiSFDcHd23uUUdP2hRb-SZXNT0aJz4O0rrjEAD5-KPo.jpg" }, { "url": "https://igx.4sqi.net/img/general/height250/2963171_W_I_mHDxupMU8MEstBlPF4LbtaM2fOJJKjv2BzyG7hk.jpg" }, { "url": "https://igx.4sqi.net/img/general/height250/33537404_23FWIJujGosh1G2FOeYreEv5R09vfykTZZO_7GFiIHU.jpg" }] } }, { "rating": "N/A", "number_of_reviews": "N/A", "source": "foursquare", "foursquare_id": "4ad75c2df964a520cd0921e3", "reviews": [{ "time": 1484662505, "text": "Awesome vibe, service is good, and the pizza is surprisingly great (had the eggplant pizza). Sweet potato app also very good. Everything very fresh", "photo_url": "https://igx.4sqi.net/img/general/height250/352960652_bOG1GODfiESjSHGRD8O0K4n6xLfelMAhZBE5STyIzZw.jpg" }, { "time": 1425055961, "text": "The pizza is good but the highlight of the evening was the antipasti, a range of meat and cheeses that comes with soft tasty bread. Winner.", "photo_url": "https://igx.4sqi.net/img/general/height250/57716105_VaRV371QnLXXzU-9xabSmTRjccBiwoJPsybuFeX7ju4.jpg" }, { "time": 1461930251, "text": "Great ambience and best pizza around London. It's all about the service and the cocktails for me though ðŸ‘", "photo_url": "https://igx.4sqi.net/img/general/height250/210492_xqWn42_JsfSxUoJKD8Wu1LfV99c5ZO0ptVBWlJjREz0.jpg" }, { "time": 1414924131, "text": "I ordered the veel pizza, the base was delicious and crispy but the topping was really salty. Next time I will choose a different topping.", "photo_url": "https://igx.4sqi.net/img/general/height250/46707504_6lsb5vBJwhpKqPaNdpqL_euegeGjNZYPY5ZKxqIRToc.jpg" }, { "time": 1487631583, "text": "The buffalo mozzarella pizza (10Â£) tastes great, but it's war with these toppings that won't stop sliding off!", "photo_url": "https://igx.4sqi.net/img/general/height250/89134291_Nj_KqD0oWO6IYfvkhmPH_9HSQScYVqT84eJGxKfMsKM.jpg" }, { "time": 1369773946, "text": "Best olives ever!!! And I don't eat olives! Don't bother with the lasagne but the pizza is goooood!", "photo_url": "https://igx.4sqi.net/img/general/height250/327380_W9m-103LeEzOtHvU3J4MFvHbgUXZiqJXqHClS2FlnKk.jpg" }] }, { "source": "instagram", "instagram_id": "pizzaeast", "reviews": [], "photos": { "url": "https://www.instagram.com/pizzaeast/?hl=en", "text": "foto by owners on " } }, { "number_of_reviews": "N/A", "source": "CondÃ© Nast Traveler", "tripexpert_id": 417773, "reviews": [], "review_article": { "url": "https://www.cntraveler.com/restaurants/london/pizza-east", "summary": "Pizza East serves tasty pies and Italian small plates in an industrial-looking space.", "by": "" } }, { "rating": "4", "number_of_reviews": "N/A", "source": "Time Out", "tripexpert_id": 286233, "reviews": [], "review_article": { "url": "http://www.timeout.com/london/restaurants/pizza-east-shoreditch", "summary": "The popularity of Pizza East, one of the first bastions of Shoreditch gentrification, hasnâ€™t waned.", "by": "" } }, { "rating": "3.5", "number_of_reviews": "N/A", "source": "Zagat", "tripexpert_id": 444971, "reviews": [], "review_article": { "url": "https://www.zagat.com/r/pizza-east-london", "summary": "It's \"always jam-packed\" at these \"trendy\", midpriced joints where diners break out of their \"pepperoni comfort zone\".", "by": "" } }, { "rating": "12", "number_of_reviews": "N/A", "source": "Gayot", "tripexpert_id": 235867, "reviews": [], "review_article": { "url": "http://www.gayot.com/restaurants/pizza-east-london-e1-6jj-uk_21lo091102.html", "summary": "The restaurant in the spacious Tea Building is big and bold, with long tables for groups, an open kitchen and a bar in the centre.", "by": "" } }, { "number_of_reviews": "N/A", "source": "BlackBook", "tripexpert_id": 210436, "reviews": [], "review_article": { "summary": "Lively gourmet pizza hall at Soho House Shoreditch looks like an old Italian kitchen, complete with wooden cabinets and countertops.", "by": "" } }, { "rating": 3.5, "number_of_reviews": 223, "source": "yelp", "yelp_id": "pizza-east-london", "reviews": [{ "rating": 4, "time": "2017-09-15 01:24:09", "text": "This is a very nice Pizzeria in the heart of Shoreditch.\nThe quality of the food is high. We started sharing delicious lamb meatball then we had one salami..." }, { "rating": 3, "time": "2017-10-18 07:16:13", "text": "Had dinner here on a Monday night (50% night) & must declare an interest inasmuch as my mate is on good terms with the staff therefore any waiting around or..." }, { "rating": 1, "time": "2017-08-12 07:44:46", "text": "By far the worst dining experience in many many years.\n\nNegatives\n- The bar area to wait while your table is ready is chaotic and slow. Maybe the concept is..." }] }, { "rating": "4.2", "number_of_reviews": "281", "source": "zomato", "zomato_id": "6104609", "reviews": [{ "rating": 4.5, "time": "3 months ago", "text": "Great place to eat it was busy on Monday because they have a half price offer on food with a fob. Get the fob. The pizza was really good and..." }, { "rating": 5, "time": "5 months ago", "text": "One of my best meals in London!  Even after screwing up the mocktail I'd asked for, they gladly changed it and brought something better on t..." }, { "rating": 4.5, "time": "5 months ago", "text": "The place is really nice and beautiful and the food especially the pizzas are extremely tasty!   However is usually too full if you don't ha..." }, { "rating": 5, "time": "6 months ago", "text": "Amazing pizzas! The crust is light and airy, delicious passion fruit and vodka cocktail, really really nice decor and setting, would love to..." }, { "rating": 4, "time": "8 months ago", "text": "I visited Pizza East with the Eating London Food Tour to try their famous salted caramel chocolate tart. I didn't enjoy it as much as expect..." }] }, { "rating": "4", "number_of_reviews": "1188", "source": "www.tripadvisor.com", "id": 0, "reviews": [] }, { "rating": "3.1", "source": "www.timeout.com", "id": 0, "reviews": [{ "time": "2013-09-24", "text": "The popularity of Pizza East, one of the first bastions of Shoreditch gentrification, hasnâ€™t waned. This Soho House operation still packs out the landmark Tea Building, with hipsters and..." }, { "time": "2016-04-29T08:42:30.000Z", "text": "I am not sure why this place is so famous, I canâ€™t quite understand the hype . It is way too difficult to book a table and to be honest, it's not even close to the best pizza I have had in..." }, { "time": "2016-04-06T10:59:35.000Z", "text": "This place is so uptight about reservations. The wait is ridiculous if you don't make a reservation. Otherwise, their pizza is fairly average, not as good as many of the others around Shoreditch..." }, { "time": "2017-10-03T11:09:57.000Z", "text": "Huge disappointment! I am a big pizza lover and together with another friend with my same passion we tend to go every month to try a new pizza place. This month we decided to try Pizza East..." }, { "time": "2017-07-30T11:08:56.000Z", "text": "I actually ended up at Pizza East for the first time for the Hogwhats Harry Potter quiz, so had a slightly different experience! Quizzers were sat in their basement area, known as Concrete..." }, { "time": "2017-04-14T17:27:19.000Z", "text": "Having heard great things about Pizza East, we decided to drop in one Friday evening. The large warehouse style restaurant has been split up in such a way that provides ambience and cosiness,..." }, { "time": "2017-03-29T22:07:31.000Z", "text": "Mondays don't get any better than those spent in Pizza East noshing on seasonal, stone-baked half-price pizza. Wash it all down with a zingy Italian aperitif or even a carafe of their house..." }, { "time": "2017-02-19T23:05:13.000Z", "text": "Yessssss delicious pizza! And from the mouth of a New Yorker, this means something. Typical NY, thin-crust pizza with a hint of burned crust. Loads of toppings and flavours. I got the aubergine..." }, { "time": "2017-01-15T20:08:12.000Z", "text": "A cold Monday is made a thousand times better with a catchup with friends at Pizza East. The Shoreditch restaurant is huge and its a really cool building with is low hanging lights and brick..." }, { "time": "2016-12-23T21:49:04.000Z", "text": "Wanting to hide from the chilly air and catch up with an old friend a few days before Christmas, I stepped into Pizza East and received a very warm welcome, with lively chatter, hints of pesto,..." }, { "time": "2016-11-06T19:55:51.000Z", "text": "Having walked past this place a million times I was excited to finally go visit the famous Pizza East, however it disappointedly didnâ€™t live up to the hype for me. I loved the place itself-..." }, { "time": "2016-08-10T10:33:20.000Z", "text": "Like most places in London now expect a wait for a table. This place is super popular but luckily for good reason. They have a little bar area where you can wait for a table - 20 mins is the..." }, { "time": "2016-07-23T18:24:41.000Z", "text": "I hadn't really heard many reviews on this place and wasn't planning on going here however my bf had been before and said the pizza was really good and we couldn't decide anywhere else to go!..." }, { "time": "2016-07-08T16:50:05.000Z", "text": "Very Cool Pizzeria that is at the heart of Shoreditch. Delicious food and good service. The restaurant is very atmospheric and airy. After work it fills out quickly and is rammed with cool..." }, { "time": "2016-02-14T15:36:21.000Z", "text": "Despite being a large restaurant, Pizza East can get very busy and I definitely recommend making a reservation. The portions are generous and the prices are reasonable. The macaroni and cheese..." }, { "time": "2015-12-09T12:27:09.000Z", "text": "I've been to Pizza East a multitude of times and have had mixed experiences, but mainly good. My main tips are as such - the mac and cheese is amazing and worth getting in place of/as well..." }, { "time": "2015-08-31T14:17:38.000Z", "text": "Again let down by a certain Indian Restaurant and their 'no reservations' policy (I swear-- 8pm on a Tuesday people... come on) we decided on Pizza East, a place I have passed numerous time..." }, { "time": "2015-08-24T16:33:05.000Z", "text": "Totally some of the best pizza you can get in London, nice chewy dough, loadsa toppings and a good selection to choose from. Really great that they have large tables making birthday or larger..." }, { "time": "2015-07-09T15:19:28.000Z", "text": "Great atmosphere and a trendy environment, really friendly staff and of course good pizza. we ate far too many starters so a bit of a watch out!." }, { "time": "2015-04-01T09:26:34.000Z", "text": "Great chilled out restaurant and excellent food! Generous portions, be careful not to order too many sides before your pizza. A friend and I shared the Mac n Cheese, Meatballs and garlic bread..." }, { "time": "2015-03-28T23:41:32.000Z", "text": "This place is awful. Staffed by incompetents. A total waste of money." }, { "time": "2015-02-16T12:33:03.000Z", "text": "Perfect for a brunch on Sunday." }, { "time": "2014-09-17T07:30:13.000Z", "text": "I had been here before some time ago and was very nice. This Saturday we were squeezed onto a table that the people next to were practically in our lap. No room to cut pizza as so squashed..." }, { "time": "2014-05-07T16:10:59.000Z", "text": "Lovely pizza, top beers and nice vibe..." }, { "time": "2014-02-05T12:52:28.000Z", "text": "The restaurant is really cool inside. We shared mac and cheese, veal meatball pizza and some brunch items, which were all really tasty. Bloody mary's were great and service was fast and friendly...." }, { "time": "2014-01-13T23:11:07.000Z", "text": "Utter shambles. Im ashamed of myself for even going there. One star is overated" }, { "time": "2013-08-29T21:15:10.000Z", "text": "The worst restaurant, if you can call that place a restaurant ever!" }, { "time": "2013-07-28T20:17:25.000Z", "text": "Great venue and good value food. It's always busy here but my group of friends and I managed to get seated at a communal table without a reservation. The food is good, though there is still..." }, { "time": "2013-05-28T18:49:47.000Z", "text": "fabulous pizzas and a great atmosphere. Read my experience on my blog: http://highteaandhighheels.wordpress.com/2013/05/11/pizza-east-shoreditch/" }, { "time": "2012-12-20T19:37:43.000Z", "text": "We booked for over 20 people and we were told that we would have to be split over two tables, which we accepted. BUT what we didn't know is that these tables would be at opposite ends of the..." }, { "time": "2012-12-18T16:03:57.000Z", "text": "Had a table booked for 8.30 for 4, but last minute there was an addition to the party. Knowing the restaurantâ€™s reputation, we arrived at 8, and were told under no circumstances could they..." }, { "time": "2012-11-19T21:47:05.000Z", "text": "Had a family lunch here today, mainly to try another of Time Out's 100 best dishes in London (Chocolate salted caramel tart), and not one of us could fault the food or drink. First up, the..." }, { "time": "2012-10-23T09:50:55.000Z", "text": "If you want to go as a group to celebrate or have a lovely evening - don't go there! I attended my friends surprise birthday party. Table was booked for 8 people, but 10 of us arrived. After..." }, { "time": "2012-09-26T19:51:17.000Z", "text": "Mediocre food for an expensive price. Decor is good, and customer service was good too. However food is nothing special for how expensive it is." }, { "time": "2012-09-03T13:22:30.000Z", "text": "Maybe I went on the good a day, but I was really impressed with the food, i did have m doubts at first... however we tried the pizza and mac and cheese and both was perfect. Seriously i loved..." }, { "time": "2012-09-02T17:11:33.000Z", "text": "Great topping on pizzas - remind me Italia. Very nice selection of wine. Wonderful deserts (chocolate and salted caramel tart my love). Great place." }, { "time": "2012-07-17T07:45:09.000Z", "text": "Cool place" }, { "time": "2012-04-09T19:53:15.000Z", "text": "awful pizza. dont go, waste of money." }, { "time": "2012-03-14T12:56:04.000Z", "text": "Clearly the who wrote the article was more interested in the area than in the food for which probably he/she has not real taste or clue. Terrible is to be nice, expensive pizzas which you can..." }, { "time": "2012-02-05T21:51:40.000Z", "text": "Good but don't get the hype" }, { "time": "2012-01-22T01:11:56.000Z", "text": "Ridiculously expensive for mediocre food. We were seated in the middle of the room and the seats were very uncomfortable. Other than that, it was very noisy, little choice in food, no gluten..." }, { "time": "2011-12-12T16:33:21.000Z", "text": "Great lunch place! It's usually near empty at lunch time. Perfect to savour a delicious pizza and get some attention from the staff (as opposed to the crowed every-man-for-themselves evenings)." }, { "time": "2011-11-20T11:22:12.000Z", "text": "The premises are pretty cool, with the usual grittiness of shoreditch and an industrial feel to it. the sevice was ok, and the food was good enough but overpriced in my opinion. I would recommend..." }, { "time": "2011-10-23T16:15:46.000Z", "text": "Went there last weekend for a friends birthday, seating was alright, and we had a few appetizers and 3 pizzas with wine, nothing more then your average fancy dinner. When we got the bill they..." }, { "time": "2011-10-07T14:43:34.000Z", "text": "Just make sure you've got a crystal ball and can get your table numbers exact. Booked online several weeks in advance for my birthday and when my party number went up by one, was told they..." }, { "time": "2011-08-04T13:56:56.000Z", "text": "I only had the option for 1 star, but actually I would give it 0.5! We went last night for a friendâ€™s birthday. He had tried to book a table for 18 over the phone, but the lady he spoke to,..." }, { "time": "2011-06-23T10:42:01.000Z", "text": "Went to Pizza East last night on a recommendation from a Friend. Worst Pizza i have ever had. I had the Meat ball pizza. Meat balls were soggy and under cooked. Pizza base was soggy. Great..." }, { "time": "2011-06-05T10:52:04.000Z", "text": "First off - **Genuinely the best pizza i have ever had**, I had the San Danielle. HOWEVER... ...There were lots of stupid things that spoiled Pizza East, for example - I ordered a glass of..." }, { "time": "2011-05-03T10:32:38.000Z", "text": "Potentially the worst pizza I ever had. Love the decor, venue, quirkiness of the place but OMG the pizzas were rubbish- the base was good and well cooked, sadly all of the toppings were dripping..." }, { "time": "2011-04-21T09:42:02.000Z", "text": "Amazlingly good brunch and Sunday lunch! Although it's hard not to tear yourself away from the pizza menu their roasts are brill" }, { "time": "2011-03-11T00:55:12.000Z", "text": "Dont bother - the worst restaurant in the world! the excuse they had for a pasta dish wasnt worth serving to the pigs let a lone paying (Â£15) customer. VILE! this is the second time i was..." }] }, { "rating": "3.8", "source": "www.opentable.com", "id": 0, "reviews": [{ "time": "2009-08-21", "text": "I really enjoyed my night out at the Drunken Monkey. I was sitting at a nice table downstairs, which has it's own bar area and is slightly cut off from the noise from upstairs. The DJ was brilliant..." }, { "time": "2009-08-11", "text": "The food was all very good - we chose the right amount of dishes and it was nice how they came up as and when ready as we had a steady stream! Shame the waitresses lacked any personality whatsoever..." }, { "time": "2009-08-04", "text": "food was great, although service isnt the best. people are slow at making sure customers are ok/happy/ want to order." }, { "time": "2009-06-19", "text": "Overall, we had a good time at the Drunken Monkey. Dim Sum and Cocktails are a perfect combination, plus I love the fact that the menu is mainly comprised of wine/beer/cocktails and all sorts..." }, { "time": "2009-06-12", "text": "Our group made a special journery to this side of London - having travelled from Hertfordshire - it was well worth it. Food was outstanding (squid was the best we have tasted), our waitress..." }, { "time": "2009-05-09", "text": "Loud. Food a bit greasy overall - can't compare with dim sum such as Yauatcha. Service quick but not overly pleasant." }, { "time": "2009-04-30", "text": "I'm a regular and the food is always fresh, timely and very tasty. Simple no-nosense stuff" }, { "time": "2009-04-30", "text": "I'm a regular and the food is always fresh, timely and very tasty. Simple no-nosense stuff" }, { "time": "2009-04-24", "text": "As soon as we got to the table we were told we had an hour, and that the table was booked for 20.00 and we would have to leave. I didn't appreciate the pressure to eat quickly, and then every..." }, { "time": "2009-04-23", "text": "The Drunken Monkey is a great place - good cocktails and fab food, plus a pretty good wine list as well (featuring a good few South American flavours) You can reserve a table for the whole..." }, { "time": "2009-04-17", "text": "The staff are really friendly and the Dim Sum was great. It makes a great lively night out and is fantastic for large groups. I will be visiting The Drunken Monkey again very soon." }, { "time": "2009-04-15", "text": "Food was lovely, great prices, lovely environment!!!!!" }, { "time": "2009-04-09", "text": "well the start wasn't the best as they had mixed up my reservation and had me down for 7.30 instead of 7pm. I was further insulted by a couple who then claimed their reservation was for 7.30..." }, { "time": "2009-04-07", "text": "People was frinedly, but it took forever to them to take our order and to bring the menus. Also we needed to shout a the waiters to order something. Food is reasonable good, not fantastic...." }, { "time": "2009-04-04", "text": "Great dim sum and good selection of happy hour cocktails. the rice and noodle portions are very large though - so don't over order" }, { "time": "2009-03-29", "text": "The food at the Drunken Monkey was very disappointing, the Crispy duck pancakes were hot but as soon as we wrapped the ducks the pancakes were extremely cold. The dim sum was very generic and..." }, { "time": "2009-03-14", "text": "Great food and fabulous happy hour cocktails. A lively bar scene so it is a perfect place to carry on drinking when you have finished your meal. I would recommend it for groups." }, { "time": "2009-03-11", "text": "This is a must book venue and perfect for a after work get together of friends. The Dim Sum menu is conducive to sharing and goes perfectly with drinking as opposed to the traditional heavy..." }, { "time": "2009-02-25", "text": "Fantastic food and delicious cocktails. However we were told 1 hour into our evening that we had to give the table up in 30 mins. Which means only a 1.5 hour turnover (most restaurants have..." }, { "time": "2009-02-20", "text": "Good venue for groups looking for somewhere to combine a few drinks with some nice nibbles. Nice atmosphere too. Not one for a quiet night with the other half." }, { "time": "2009-02-20", "text": "Quite tasty food although a little expensive." }, { "time": "2009-02-12", "text": "Great food and atmosphere, always love coming here :)" }, { "time": "2009-02-11", "text": "Food was lovely & I always enjoy the venue. found staff quite difficult though, and we did get burnt noodles - though they tired to argue they were crispy...Also we was getting rushed off our..." }, { "time": "2009-02-01", "text": "I enjoyed the dim sum, but it was a cold day and with only one door between the outside world and the restaurant, there a cold chill ran through the restaurant & whilst the restaurant can't..." }, { "time": "2009-01-24", "text": "Fabulous as alway what more can I say!" }, { "time": "2009-01-20", "text": "The food and service is always excellent." }, { "time": "2009-01-19", "text": "Lovely fresh food, good service, would defiietely go back!" }, { "time": "2009-01-17", "text": "This bar / restaurant is a real gem. The food is really good for a bar / restaurant, the cocktails are fantastic and the staff are really friendly. Atmosphere is relaxed unpretentious and perfect..." }, { "time": "2009-01-15", "text": "Had a late meal here with friends the other evening after a private view. Food was just what we needed and we were able to carry on partying until the wee hours!" }, { "time": "2009-01-12", "text": "Food was tasty. Staff really helpful and nice. A reall good Monday night out!" }, { "time": "2009-01-10", "text": "I visited a year ago and was appalled by the general attitude and incompetence of the management and staff. A friend persuaded me to go again and I was plesantly surprised/relieved by the changes...." }, { "time": "2008-12-05", "text": "The food (when it arrived) was very good, and the portion size was notable. Our dining experience was marred by two things, our order was incomplete when it finally arrived - one member of..." }, { "time": "2008-11-21", "text": "The Drunken Monkey is great for meeting friends and having a quick bite, it's always very busy so unless you book you could wait a while for a table in the evening. The bar is busy in the evenings..." }, { "time": "2008-11-21", "text": "The Drunken Monkey is great for meeting friends and having a quick bite, it's always very busy so unless you book you could wait a while for a table in the evening. The bar is busy in the evenings..." }, { "time": "2008-11-14", "text": "Great place for a Friday night if you want some good food after work but you don't want to go to a restuarant and miss out on the momentum a bar after work provides. Foos delicious and ideal..." }, { "time": "2008-11-14", "text": "Drunken Monkey was great value for money. The restaurant / bar area felt a bit dingy but overall it had a good vibe. The food was great and really cheap. Staff were also very friendly and helpful...." }, { "time": "2008-11-12", "text": "Was great as always aside from being asked to leave our table after only one hour and 15 minutes. We spent a fair amount and thought it was very rude of the staff to ask us to leave." }, { "time": "2008-11-08", "text": "Great place, nice ambiance. Food was excellent as well as service.The only trouble was the loud music making it impossible to hold conversation at the table. It's really a shame, I guess to..." }, { "time": "2008-11-07", "text": "The food and cocktails are great. A bit of a shame that we were only allocated the table for an hour and a half especially as the staff were slow to serve food and drinks and we werenâ€™t told..." }, { "time": "2008-11-05", "text": "The dim sum at the Drunken Monkey was not the best I've had. The steamed dim sum tasted a little doughy and the pork buns were a little dry. They also forgot to bring out one of the dishes..." }] }] }