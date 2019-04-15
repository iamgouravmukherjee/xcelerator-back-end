const router = require('express').Router();
const postModel = require('../model/post');


router.get('/', (req, res, next) => {
   postModel.find({})
      .then(response => {
         res.status(201).json({ message: 'documents found', data: response })
      })
      .catch(error => {
         console.log('error', error);
         res.status(400).json({ message: 'unable to find documents', error });
      })
})

router.get('/:id', (req, res, next) => {
   postModel.find({ id: req.params.id })
      .then(response => {
         res.status(200).json({ message: 'document found', data: response })
      })
      .catch(error => {
         res.status(400).json({ message: 'unable to find document', error })
      })
})

router.post('', (req, res, next) => {

   const paths = {
      0: "https://images.unsplash.com/photo-1422255198496-21531f12a6e8?dpr=2&auto=format&fit=crop&w=1500&h=996&q=80&cs=tinysrgb&crop=",
      1: "https://images.unsplash.com/photo-1490914327627-9fe8d52f4d90?dpr=2&auto=format&fit=crop&w=1500&h=2250&q=80&cs=tinysrgb&crop=",
      2: "https://images.unsplash.com/photo-1476097297040-79e9e1603142?dpr=2&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop=",
      3: "https://images.unsplash.com/photo-1464652149449-f3b8538144aa?dpr=2&auto=format&fit=crop&w=1500&h=1000&q=80&cs=tinysrgb&crop=",
      4: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?dpr=2&amp;auto=format&amp;fit=crop&amp;w=1500&amp;h=1000&amp;q=80&amp;cs=tinysrgb&amp;crop="
   }

   let docs = req.body.data;
   docs = docs.map(doc => {
      doc['imageUrl'] = paths[Math.floor(Math.random() * 4)]
      return doc;
   })

   postModel.insertMany(docs)
      .then(response => {
         res.status(201).json({ message: 'documents inserted successfully', data: response })
      })
      .catch(error => {
         console.log('error', error);
         res.status(400).json({ message: 'unable to insert documents', error });
      })
})

router.patch('/:id', (req, res, next) => {
   console.log(req.body.type);
   postModel.find({ id: req.params.id })
      .then(doc => {
         if (doc.length > 0) {
            console.log('doc', doc[0]);
            let fields;
            switch (req.body.type) {
               case "liked":
                  fields = { liked: !doc[0].liked, disliked: false }
                  break;
               case "disliked":
                  fields = { disliked: !doc[0].disliked, liked: false }
                  break;
               case "bookmarked":
                  fields = { bookmarked: !doc[0].bookmarked }
                  break;
               default:
                  res.status(400).json({ message: 'unable to update documents', error: "Invalid action type" });
                  next();
            }
            postModel.findOneAndUpdate({ id: req.params.id }, { $set: { ...fields } })
               .then(response => {
                  res.status('201').json({ message: 'updated successfully', data: response })
               })
               .catch(error => {
                  console.log('error', error);
                  res.status(400).json({ message: 'unable to update documents', error });
               })
         } else {
            res.status(400).json({ message: 'unable to update documents', error: "Could not find a post with that id" });
         }
      })
      .catch(error => {
         console.log('error', error);
         res.status(400).json({ message: 'unable to update documents', error });
      })
})

module.exports = router;