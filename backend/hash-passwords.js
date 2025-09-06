const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Use your MongoDB connection string
const uri = 'mongodb+srv://creditlendingdb:creditlendingdb1@credit-lending-cluster.ei4dukf.mongodb.net/test';

async function hashAllPasswords() {
    try {
        // Connect to MongoDB
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('Connected to MongoDB');
        
        // Get all users from allusers collection
        const users = await mongoose.connection.db.collection('allusers').find({}).toArray();
        console.log(`Found ${users.length} users in allusers collection`);
        
        let updatedCount = 0;
        
        for (const user of users) {
            // Check if password is already hashed (bcrypt hashes start with $2)
            if (user.password && !user.password.startsWith('$2')) {
                console.log(`Hashing password for user: ${user.email}`);
                
                // Hash the plain text password
                const hashedPassword = await bcrypt.hash(user.password, 10);
                
                // Update the user in database
                await mongoose.connection.db.collection('allusers').updateOne(
                    { _id: user._id },
                    { $set: { password: hashedPassword } }
                );
                
                updatedCount++;
                console.log(`✓ Updated password for: ${user.email}`);
            } else {
                console.log(`⏭ Password already hashed for: ${user.email}`);
            }
        }
        
        console.log(`\n🎉 Password hashing complete!`);
        console.log(`📊 Total users processed: ${users.length}`);
        console.log(`🔒 Passwords hashed: ${updatedCount}`);
        
    } catch (error) {
        console.error('Error hashing passwords:', error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the script
hashAllPasswords();
