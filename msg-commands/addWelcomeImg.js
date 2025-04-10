module.exports = {
    prefix: "!=AddWelcomeImg",
    fn: (msg) =>{
        if(msg.author.bot){
            return
        };

        const admin = require('firebase-admin');
        const db = admin.firestore();

        try{
            const { PermissionsBitField } = require('discord.js');
            if (msg.author.id === msg.guild.ownerID || msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const args = msg.content.split(" ");

                if(!args[1]){
                    return msg.reply({content: '指令格式錯誤，此指令格式為`!=AddWelcomeImg 圖片網址`，請重新輸入'})
                };

                const urlTest = (test) => {
                    try{
                        new URL(test);
                    } catch(err) {
                        return false;
                    }
                    return true;
                };
    
                const tryUrl = urlTest(args[1]);
                
                if(tryUrl == false){
                    return msg.reply({content: '你輸入的不是網址或網址輸入錯誤，網址前必須以`https://` 或 `http://` 這兩種格式開頭'})
                };

                const guildID = msg.guild.id;
                const imgUrl = db.collection('Img').doc(guildID);


                imgUrl.get().then(res => {
                    if(!res.exists){
                        imgUrl.set({
                            WelcomeImg: admin.firestore.FieldValue.arrayUnion(args[1])
                        })

                        .then(
                            console.log("Set new Welcome Img success: " + args[1])
                        );
                    }

                    if(res.exists){
                        imgUrl.update({
                            WelcomeImg: admin.firestore.FieldValue.arrayUnion(args[1])
                        })

                        .then(
                            console.log("Set new Welcome Img success: " + args[1])
                        );
                    }
                })

                .catch((err) => {
                    console.error("An error has occurred: ", err);
                });

                return msg.reply({ content: `新增歡迎圖： ${args[1]}` });

            } else {
                return msg.channel.send({content:'這個指令只能由頻道擁有者，或擁有管理者權限者使用'})         
            };
        } catch (err){
            console.error(err);
        };
    }
}