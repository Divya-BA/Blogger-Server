const router = require('express').Router();
const User = require('../models/User')
const Post = require('../models/Post')
const bcrypt = require('bcrypt');

// Create
router.post('/', async (req, res) => {
    console.log(req.body);
    const newPost = new Post(req.body)
    try {
        const savePost = await newPost.save()
        res.status(200).json(savePost)
    } catch (err) {
        res.status(500).json(err)
    }
})

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.username === req.body.username) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
                    $set: req.body
                }, { new: true })
                res.status(200).json(updatedPost)
            } catch (error) {
                res.status(500).json("YOU CAN UPDATE ONLY YOUR POST")
            }
        }
        else {
            res.status(401).json("YOU CAN UPDATE ONLY YOUR POST")
        }
    } catch (err) {
        res.status(401).json("YOU CAN UPDATE ONLY YOUR POST")
        console.log(err);
    }
})

// GET
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (e) {
        console.log(e);
        res.status(404).json("USER NOT FOUND")
    }
})


router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.username === req.body.username) {
            try {
                await Post.deleteOne({ _id: req.params.id });
                res.status(200).json("POST DELETED");
            } catch (error) {
                console.log(error);
                res.status(500).json("YOU CAN DELETE ONLY YOUR POST");
            }
        } else {
            res.status(401).json("YOU CAN DELETE ONLY YOUR POST");
        }
    } catch (err) {
        console.log(err);
        res.status(401).json("YOU CAN DELETE ONLY YOUR POST");
    }
})

// GET ALL POSTS
router.get("/", async (req, res) => {
    const userName = req.query.username
    const catName = req.query.cat
    try {
        let posts;
        if (userName) {
            posts = await Post.find({ username: userName }).sort({ date: -1 })
        }
        else if (catName) {
            posts = await Post.find({
                categories: {
                    $in: [catName]
                }
            })
        } else {
            posts = await Post.find().sort({ createdAt: -1 })
        }
        res.status(200).json(posts)
    } catch (e) {
        console.log(e);
        res.status(500).json(e)
    }
})

module.exports = router