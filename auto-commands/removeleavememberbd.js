module.exports = (client) => {
    client.on('guildMemberRemove', async (member) => {
        if (member.user.bot) {
            return;
        };

        try{
            const guildID = member.guild.id;
            const memberID = member.user.id;

            const admin = require('firebase-admin');
    
            const db = admin.firestore();
            const membersearch = db.collection('BDdata').doc(guildID);
            const membersearchr = await membersearch.get();

            if(!membersearchr.exists){
                return console.log(`There's no BD Data of guildID: ${guildID} .`);
            } else {
                if(membersearchr.data()[memberID] === undefined){
                    return console.log(`There's no BD Data of userID: ${memberID} .`);
                } else {
                    membersearch.update({
                        [memberID]:admin.firestore.FieldValue.delete()
                    });
                    return console.log(`The Removal of the Birthday data of userID: ${memberID} has successed.` )
                };             
            };
        } catch(err) {
            return console.error('An error has occurred: ' + err);
        };
    });
};