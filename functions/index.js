const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const { database } = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();
const itemsRef = db.collection('items');

// TODOs
// Send messages to pub/sub when all messages are invoked

// On Profile/{userId}/items/{itemId} document created
exports.createProfileItem = functions.firestore
    .document(`profile/{userId}/items/{itemId}`)
    .onCreate(async (snap, context) => {
        const newValue = snap.data();
        const _title = newValue.title;
        const _price = newValue.price;
        const _description = newValue.description;
        const _dateAdded = newValue.dateAdded;
        const _dateModified = newValue.dateModified;
        const _imageUrls = newValue.images;
        const userId = context.params.userId;
        const itemId = context.params.itemId;

        const doc = await db.collection('profile').doc(`${userId}`).get();

        if (!doc.exists) {
            console.log('No such document!');
        } else {
            console.log('Document data:', doc.data());
        }
        // console.log(doc.data()['location']['_latitude'])
        const _location = doc.data()['gpsLocation'];
        const _phoneNumber = doc.data()['phoneNumber'];
        const _businessName = doc.data()['businessName'];
        const _businessDescription = doc.data()['businessDescription'];
        const _locationDescription = doc.data()['locationDescription'];
        const _mondayOpeningHours = doc.data()['mondayOpeningHours'];
        const _mondayClosingHours = doc.data()['mondayClosingHours'];
        const _tuesdayOpeningHours = doc.data()['tuesdayOpeningHours'];
        const _tuesdayClosingHours = doc.data()['tuesdayClosingHours'];
        const _wednesdayOpeningHours = doc.data()['wednesdayOpeningHours'];
        const _wednesdayClosingHours = doc.data()['wednesdayClosingHours'];
        const _thursdayOpeningHours = doc.data()['thursdayOpeningHours'];
        const _thursdayClosingHours = doc.data()['thursdayClosingHours'];
        const _fridayOpeningHours = doc.data()['fridayOpeningHours'];
        const _fridayClosingHours = doc.data()['fridayClosingHours'];
        const _saturdayOpeningHours = doc.data()['saturdayOpeningHours'];
        const _saturdayClosingHours = doc.data()['saturdayClosingHours'];
        const _sundayOpeningHours = doc.data()['sundayOpeningHours'];
        const _sundayClosingHours = doc.data()['sundayClosingHours'];

        // Create doc in firebase collection
        await itemsRef.doc(`${itemId}`).set({
            itemId: itemId,
            userId: userId,
            location: _location,
            phoneNumber: _phoneNumber,
            businessName: _businessName,
            businessDescription: _businessDescription,
            locationDescription: _locationDescription,
            title: _title,
            description: _description,
            price: _price,
            dateAdded: _dateAdded,
            dateModified: _dateModified,
            images: _imageUrls,
            mondayOpeningHours: _mondayOpeningHours,
            mondayClosingHours: _mondayClosingHours,
            tuesdayOpeningHours: _tuesdayOpeningHours,
            tuesdayClosingHours: _tuesdayClosingHours,
            wednesdayOpeningHours: _wednesdayOpeningHours,
            wednesdayClosingHours: _wednesdayClosingHours,
            thursdayOpeningHours: _thursdayOpeningHours,
            thursdayClosingHours: _thursdayClosingHours,
            fridayOpeningHours: _fridayOpeningHours,
            fridayClosingHours: _fridayClosingHours,
            saturdayOpeningHours: _saturdayOpeningHours,
            saturdayClosingHours: _saturdayClosingHours,
            sundayOpeningHours: _sundayOpeningHours,
            sundayClosingHours: _sundayClosingHours
        });
    });

// on Profile/{userId}/items/{itemId} document deleted
exports.deleteProfileItem = functions.firestore
    .document('profile/{userId}/items/{itemId}')
    .onDelete(async (snap, context) => {
        // Delete document in /items collection
        const itemId = context.params.itemId;
        await itemsRef.doc(itemId).delete();
    });

// On Profile/{userId}/items/{itemId} document updated
exports.updateProfileItem = functions.firestore
    .document('profile/{userId}/items/{itemId}')
    .onUpdate(async (snap, context) => {
        // Update the items collection
        itemId = context.params.itemId;
        const dataBefore = change.before.data();
        const dataAfter = change.after.data();
        if (dataAfter.title === dataBefore.title) {
            return null;
        } else {
            await itemsRef.doc(itemId).set({ 'title': dataAfter.title }, { merge: true });
        }
        if (dataAfter.description === dataBefore.description) {
            return null;
        } else {
            await itemsRef.doc(itemId).set({ 'description': dataAfter.description }, { merge: true });
        }
        if (dataAfter.price === dataBefore.price) {
            return null;
        } else {
            await itemsRef.doc(itemId).set({ 'price': dataAfter.price }, { merge: true });
        }
    });

// On Profile/{userId} Update -> Update the /items collection
exports.profileUpdate = functions.firestore
    .document('profile/{userId}')
    .onUpdate(async (change, context) => {
        const userId = context.params.userId;
        const dataBefore = change.before.data();
        const dataAfter = change.after.data();
        // Fetch all documents with the userId
        const profileSnapshots = await itemsRef.where('userId', '==', `${userId}`).get();
        // Update all the documents in /items collection
        profileSnapshots.forEach(async (doc) => {
            const docId = doc.id;
            if (dataAfter.businessName === dataBefore.businessName) {
                return null;
            } else {
                await itemsRef.doc(docId).set({ 'businessName': dataAfter.businessName }, { merge: true });
            }
            if (dataAfter.location === dataBefore.location) {
                return null;
            } else {
                await itemsRef.doc(docId).set({ 'location': dataAfter.location }, { merge: true });
            }
            if (dataAfter.locationDescription === dataBefore.locationDescription) {
                return null;
            } else {
                await itemsRef.doc(docId).set({ 'locationDescription': dataAfter.locationDescription }, { merge: true });
            }
            if (dataAfter.businessDescription === dataBefore.businessDescription) {
                return null;
            } else {
                await itemsRef.doc(docId).set({ 'businessDescription': dataAfter.businessDescription }, { merge: true });
            }
            if (dataAfter.phoneNumber === dataBefore.phoneNumber) {
                return null;
            } else {
                await itemsRef.doc(docId).set({ 'phoneNumber': dataAfter.phoneNumber }, { merge: true });
            }
            // Monday
            if (dataAfter.mondayOpeningHours === dataBefore.mondayOpeningHours) {
                return null;
            } else {
                await itemsRef.doc(docId).set({ 'mondayOpeningHours': dataAfter.mondayOpeningHours }, { merge: true });
            }
            if (dataAfter.mondayClosingHours === dataBefore.mondayClosingHours) {
                return null;
            } else {
                await itemsRef.doc(docId).set({ 'mondayClosingHours': dataAfter.mondayClosingHours }, { merge: true });
            }
            // Tuesday
            if (dataAfter.tuesdayOpeningHours === dataBefore.tuesdayOpeningHours) {
                return null;
            } else {
                await itemsRef.doc(docId).set({ 'tuesdayOpeningHours': dataAfter.tuesdayOpeningHours }, { merge: true });
            }
            if (dataAfter.tuesdayClosingHours === dataBefore.tuesdayClosingHours) {
                return null;
            } else {
                await itemsRef.doc(docId).set({ 'tuesdayClosingHours': dataAfter.tuesdayClosingHours }, { merge: true });
            }
            // Wednesday
            if (dataAfter.wednesdayOpeningHours === dataBefore.wednesdayOpeningHours) {
                return null;
            } else {
                await itemsRef.doc(docId).set({ 'wednesdayOpeningHours': dataAfter.wednesdayOpeningHours }, { merge: true });
            }
            if (dataAfter.wednesdayClosingHours === dataBefore.wednesdayClosingHours) {
                return null;
            } else {
                await itemsRef.doc(docId).set({ 'wednesdayClosingHours': dataAfter.wednesdayClosingHours }, { merge: true });
            }
            // Thursday
            if (dataAfter.thursdayOpeningHours === dataBefore.thursdayOpeningHours) {
                return null;
            } else {
                await itemsRef.doc(docId).set({ 'thursdayOpeningHours': dataAfter.thursdayOpeningHours }, { merge: true });
            }
            if (dataAfter.thursdayClosingHours === dataBefore.thursdayClosingHours) {
                return null;
            } else {
                await itemsRef.doc(docId).set({ 'thursdayClosingHours': dataAfter.thursdayClosingHours }, { merge: true });
            }
            // Friday
            if (dataAfter.fridayOpeningHours === dataBefore.fridayOpeningHours) {
                return null;
            } else {
                await itemsRef.doc(docId).set({ 'fridayOpeningHours': dataAfter.fridayOpeningHours }, { merge: true });
            }
            if (dataAfter.fridayClosingHours === dataBefore.fridayClosingHours) {
                return null;
            } else {
                await itemsRef.doc(docId).set({ 'fridayClosingHours': dataAfter.fridayClosingHours }, { merge: true });
            }
            // Saturday
            if (dataAfter.saturdayOpeningHours === dataBefore.saturdayOpeningHours) {
                return null;
            } else {
                await itemsRef.doc(docId).set({ 'saturdayOpeningHours': dataAfter.saturdayOpeningHours }, { merge: true });
            }
            if (dataAfter.saturdayClosingHours === dataBefore.saturdayClosingHours) {
                return null;
            } else {
                await itemsRef.doc(docId).set({ 'saturdayClosingHours': dataAfter.saturdayClosingHours }, { merge: true });
            }
            // Sunday
            if (dataAfter.sundayOpeningHours === dataBefore.sundayOpeningHours) {
                return null;
            } else {
                await itemsRef.doc(docId).set({ 'sundayOpeningHours': dataAfter.sundayOpeningHours }, { merge: true });
            }
            if (dataAfter.sundayClosingHours === dataBefore.sundayClosingHours) {
                return null;
            } else {
                await itemsRef.doc(docId).set({ 'sundayClosingHours': dataAfter.sundayClosingHours }, { merge: true });
            }
        });
    });

// On Item Create -> Index to Elasticsearch
exports.itemsCollectionCreate = functions.firestore
    .document('items/{itemId}')
    .onCreate(async (snap, context) => {
        const itemId = context.params.itemId;
        const url = 'https://api.beammart.app/index';
        // const url = 'http://127.0.0.1:8000/index';
        const item = {
            itemId: itemId
        };
        // Create document in Elasticsearch
        const data = snap.data()

        const userId = data.userId;
        const images = data.images;
        const title = data.title;
        const description = data.description;
        const price = data.price;
        const category = data.category;
        const subCategory = data.subCategory;
        const location = data.location;
        const locationDescription = data.locationDescription;
        const businessName = data.businessName;
        const businessDescription = data.businessDescription;
        const dateAdded = data.dateAdded;
        const dateModified = data.dateModified;
        const phoneNumber = data.phoneNumber;
        const inStock = data.inStock;
        const mondayOpeningHours = data.mondayOpeningHours;
        const mondayClosingHours = data.mondayClosingHours;
        const tuesdayOpeningHours = data.tuesdayOpeningHours;
        const tuesdayClosingHours = data.tuesdayClosingHours;
        const wednesdayOpeningHours = data.wednesdayOpeningHours;
        const wednesdayClosingHours = data.wednesdayClosingHours;
        const thursdayOpeningHours = data.thursdayOpeningHours;
        const thursdayClosingHours = data.thursdayClosingHours;
        const fridayOpeningHours = data.fridayOpeningHours;
        const fridayClosingHours = data.fridayClosingHours;
        const saturdayOpeningHours = data.saturdayOpeningHours;
        const saturdayClosingHours = data.saturdayClosingHours;
        const sundayOpeningHours = data.sundayOpeningHours;
        const sundayClosingHours = data.sundayClosingHours;

        if (userId != null) {
            item.userId = userId;
        }
        if (images != null) {
            item.images = images;
        }
        if (description != null) {
            item.description = description;
        }
        if (title != null) {
            item.title = title;
        }
        if (price != null) {
            item.price = price;
        }
        if (category != null) {
            item.category = category;
        }
        if (subCategory != null) {
            item.subCategory = subCategory;
        }
        if (location != null) {
            item.location = location;
        }
        if (locationDescription != null) {
            item.locationDescription = locationDescription;
        }
        if (businessName != null) {
            item.businessName = businessName;
        }
        if (businessDescription != null) {
            item.businessDescription = businessDescription;
        }
        if (dateAdded != null) {
            item.dateAdded = dateAdded;
        }
        if (dateModified != null) {
            item.dateModified = dateModified;
        }
        if (phoneNumber != null) {
            item.phoneNumber = phoneNumber;
        }
        if (inStock != null) {
            item.inStock = inStock;
        }
        if (mondayOpeningHours != null) {
            item.mondayOpeningHours = mondayOpeningHours;
        }
        if (mondayClosingHours != null) {
            item.mondayClosingHours = mondayClosingHours;
        }
        if (tuesdayOpeningHours != null) {
            item.tuesdayOpeningHours = tuesdayOpeningHours;
        }
        if (tuesdayClosingHours != null) {
            item.tuesdayClosingHours = tuesdayClosingHours;
        }
        if (wednesdayOpeningHours != null) {
            item.wednesdayOpeningHours = wednesdayOpeningHours;
        }
        if (wednesdayClosingHours != null) {
            item.wednesdayClosingHours = wednesdayClosingHours;
        }
        if (thursdayOpeningHours != null) {
            item.thursdayOpeningHours = thursdayOpeningHours;
        }
        if (thursdayClosingHours != null) {
            item.thursdayClosingHours = thursdayClosingHours;
        }
        if (fridayOpeningHours != null) {
            item.fridayOpeningHours = fridayOpeningHours;
        }
        if (fridayClosingHours != null) {
            item.fridayClosingHours = fridayClosingHours;
        }
        if (saturdayOpeningHours != null) {
            item.saturdayOpeningHours = saturdayOpeningHours;
        }
        if (saturdayClosingHours != null) {
            item.saturdayClosingHours = saturdayClosingHours;
        }
        if (sundayOpeningHours != null) {
            item.sundayOpeningHours = sundayOpeningHours;
        }
        if (sundayClosingHours != null) {
            item.sundayClosingHours = sundayClosingHours;
        }

        const jsonItem = JSON.stringify(item);
        console.log(jsonItem);
        axios({
            method: 'POST',
            url: url,
            data: jsonItem
        })
            .then(data => console.log(data))
            .catch(err => console.log(err));

    });

// On Item Update -> Update Item in Elasticsearch
exports.itemsCollectionUpdate = functions.firestore
    .document('items/{itemId}')
    .onUpdate(async (change, context) => {
        const docId = context.params.itemId;
        const dataBefore = change.before.data();
        const dataAfter = change.after.data();
        const url = 'https://api.beammart.app/index';
        // const url = 'http://127.0.0.1:8000/index';
        // Update document in Elasticsearch

        if (dataBefore.businessName === dataBefore.businessName) {
            return null;
        } else {
            // await client.index({
            //     index: 'items',
            //     id: docId,
            //     body: {
            //         'businessName': dataAfter.businessName
            //     }
            // });
            const item = {
                itemId: docId,
                businessName: dataAfter.businessName
            }
            const jsonItem = JSON.stringify(item);
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.businessDescription === dataBefore.businessDescription) {
            return null;
        } else {
            const item = {
                itemId: docId,
                businessDescription: dataAfter.businessDescription
            }
            const jsonItem = JSON.stringify(item);
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.location === dataBefore.location) {
            return null;
        } else {
            const item = {
                itemId: docId,
                location: dataAfter.location
            }
            const jsonItem = JSON.stringify(item);
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.locationDescription === dataBefore.locationDescription) {
            return null;
        } else {
            const item = {
                itemId: docId,
                locationDescription: dataAfter.locationDescription
            }
            const jsonItem = JSON.stringify(item);
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.phoneNumber === dataBefore.phoneNumber) {
            return null;
        } else {
            const item = {
                itemId: docId,
                phoneNumber: dataAfter.phoneNumber
            }
            const jsonItem = JSON.stringify(item)
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.title === dataBefore.title) {
            return null;
        } else {
            const item = {
                itemId: docId,
                title: dataAfter.title
            }
            const jsonItem = JSON.stringify(item)
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.description === dataBefore.description) {
            return null;
        } else {
            const item = {
                itemId: docId,
                description: dataAfter.description
            }
            const jsonItem = JSON.stringify(item)
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.price === dataBefore.price) {
            return null;
        } else {
            const item = {
                itemId: docId,
                price: dataAfter.price
            }
            const jsonItem = JSON.stringify(item)
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.dateAdded === dataBefore.dateAdded) {
            return null;
        } else {
            const item = {
                itemId: docId,
                dateAdded: dataAfter.dateAdded
            }
            const jsonItem = JSON.stringify(item)
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.dateModified === dataBefore.dateModified) {
            return null;
        } else {
            const item = {
                itemId: docId,
                dateModified: dataAfter.dateModified
            }
            const jsonItem = JSON.stringify(item)
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.images === dataBefore.images) {
            return null;
        } else {
            const item = {
                itemId: docId,
                images: dataAfter.images
            }
            const jsonItem = JSON.stringify(item)
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.mondayOpeningHours === dataBefore.mondayOpeningHours) {
            return null;
        } else {
            const item = {
                itemId: docId,
                mondayOpeningHours: dataAfter.mondayOpeningHours
            }
            const jsonItem = JSON.stringify(item)
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.mondayClosingHours === dataBefore.mondayClosingHours) {
            return null;
        } else {
            const item = {
                itemId: docId,
                mondayClosingHours: dataAfter.mondayClosingHours
            }
            const jsonItem = JSON.stringify(item)
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.tuesdayOpeningHours === dataBefore.tuesdayOpeningHours) {
            return null;
        } else {
            const item = {
                itemId: docId,
                tuesdayOpeningHours: dataAfter.tuesdayOpeningHours
            }
            const jsonItem = JSON.stringify(item)
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.tuesdayClosingHours === dataBefore.tuesdayClosingHours) {
            return null;
        } else {
            const item = {
                itemId: docId,
                tuesdayClosingHours: dataAfter.tuesdayClosingHours
            }
            const jsonItem = JSON.stringify(item)
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.wednesdayOpeningHours === dataBefore.wednesdayOpeningHours) {
            return null;
        } else {
            const item = {
                itemId: docId,
                wednesdayOpeningHours: dataAfter.wednesdayOpeningHours
            }
            const jsonItem = JSON.stringify(item)
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.wednesdayClosingHours === dataBefore.wednesdayClosingHours) {
            return null;
        } else {
            const item = {
                itemId: docId,
                wednesdayClosingHours: dataAfter.wednesdayClosingHours
            }
            const jsonItem = JSON.stringify(item)
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.thursdayOpeningHours === dataBefore.thursdayOpeningHours) {
            return null;
        } else {
            const item = {
                itemId: docId,
                thursdayOpeningHours: dataAfter.thursdayOpeningHours
            }
            const jsonItem = JSON.stringify(item)
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.thursdayClosingHours === dataBefore.thursdayClosingHours) {
            return null;
        } else {
            const item = {
                itemId: docId,
                thursdayClosingHours: dataAfter.thursdayClosingHours
            }
            const jsonItem = JSON.stringify(item)
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.fridayOpeningHours === dataBefore.fridayOpeningHours) {
            return null;
        } else {
            const item = {
                itemId: docId,
                fridayOpeningHours: dataAfter.fridayOpeningHours
            }
            const jsonItem = JSON.stringify(item)
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.fridayClosingHours === dataBefore.fridayClosingHours) {
            return null;
        } else {
            const item = {
                itemId: docId,
                fridayClosingHours: dataAfter.fridayClosingHours
            }
            const jsonItem = JSON.stringify(item)
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.saturdayOpeningHours === dataBefore.saturdayOpeningHours) {
            return null;
        } else {
            const item = {
                itemId: docId,
                saturdayOpeningHours: dataAfter.saturdayOpeningHours
            }
            const jsonItem = JSON.stringify(item)
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.saturdayClosingHours === dataBefore.saturdayClosingHours) {
            return null;
        } else {
            const item = {
                itemId: docId,
                saturdayClosingHours: dataAfter.saturdayClosingHours
            }
            const jsonItem = JSON.stringify(item)
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.sundayOpeningHours === dataBefore.sundayOpeningHours) {
            return null;
        } else {
            const item = {
                itemId: docId,
                sundayOpeningHours: dataAfter.sundayOpeningHours
            }
            const jsonItem = JSON.stringify(item)
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
        if (dataBefore.sundayClosingHours === dataBefore.sundayClosingHours) {
            return null;
        } else {
            const item = {
                itemId: docId,
                sundayClosingHours: dataAfter.sundayClosingHours
            }
            const jsonItem = JSON.stringify(item)
            axios({
                method: 'POST',
                url: url,
                data: jsonItem
            })
                .then(data => console.log(data))
                .catch(err => console.log(err));
        }
    });

// On Item Delete -> Delete Item in Elasticsearch
exports.itemsCollectionDelete = functions.firestore
    .document('items/{itemId}')
    .onDelete(async (snap, context) => {
        const itemId = context.params.itemId;
        const url = 'https://api.beammart.app/delete';
        // const url = 'http://127.0.0.1:8000/delete';
        const item = {
            itemId: itemId,
            admin_email: "admin@localhost.com"
        }
        const jsonItem = JSON.stringify(item);

        axios({
            method: 'POST',
            url: url,
            data: jsonItem
        })
    })

// const url = 'https://api.beammart.app/index';
// const user = {
//     name: "Said",
//     id: 21
// }
// axios({
//     method: "POST",
//     url: url,
//     data: {
//         user
//     }
// })
//     .then(data => console.log(data))
//     .catch(err => console.log(err))
