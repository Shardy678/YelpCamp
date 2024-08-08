const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const axios = require('axios') 
const Campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
        console.log('Connected to MongoDB!');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
}

main();

const sample = (array) => array[Math.floor(Math.random()*array.length)]

const getRandomImage = async () => {
    try {
        const response = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                client_id: 'RxIH3NClIyowOZvGLYWvfdkTkfoLT0CUBDyHTbPIukU', 
                query: 'camping',
                count: 1
            }
        });
        return response.data[0].urls.regular; 
    } catch (err) {
        console.error('Error fetching image from Unsplash:', err);
        return ''; 
    }
}

const seedDB = async () => {
    try {
        await Campground.deleteMany({});
        console.log('Cleared existing campgrounds.');

        const campPromises = [];
        for (let i = 0; i < 50; i++) {
            const random1000 = Math.floor(Math.random() * 1000);
            const price = Math.floor(Math.random() * 20) + 10;
            const camp = new Campground({
                author: '66b23a2f78d093868dd8a00e',
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae unde qui cupiditate modi tempora, quidem numquam vel dolorum velit magnam, quos corporis blanditiis facere reprehenderit ducimus sunt impedit itaque inventore!',
                price: price,
                images: [
                    {
                      url: 'https://res.cloudinary.com/dw5fl7zgc/image/upload/v1723105490/YelpCamp/luqr1rvgfw15vkrsyumc.jpg',
                      filename: 'YelpCamp/luqr1rvgfw15vkrsyumc',
                    },
                    {
                      url: 'https://res.cloudinary.com/dw5fl7zgc/image/upload/v1723105490/YelpCamp/gqbjxuvrs9t0nh0uyttg.jpg',
                      filename: 'YelpCamp/gqbjxuvrs9t0nh0uyttg',
                    }
                  ]
            });
            campPromises.push(camp.save().catch(err => {
                console.error('Validation error:', err);
            })); 
        }
        await Promise.all(campPromises);
        console.log('Database seeded successfully!');
    } catch (err) {
        console.error('Error seeding the database:', err);
    } finally {
        mongoose.connection.close(); 
    }
}


seedDB();
