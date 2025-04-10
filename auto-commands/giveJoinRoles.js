module.exports = (client) => {
    client.on('guildMemberAdd', async(member) => {

        //排除機器人
        if (member.user.bot) {
            return;
        };

        try {
            const guildID = member.guild.id;
            const admin = require('firebase-admin');
    
            const db = admin.firestore();
            const roleIDdata = db.collection('GiveRole').doc(guildID);
            const roleIDdatar = await roleIDdata.get();
            if(roleIDdatar.exists){
                const roles = roleIDdatar.data().JoinRoles;
                roles.forEach((role) => member.roles.add(role));
            } else {
                console.log(`Sever ${guildID} has no Join Roles`);
                return
            }
        } catch(err) {
            return console.error(err);
        };
    });
};