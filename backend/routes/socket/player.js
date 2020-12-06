const db = require('../../db');
const {logger} = require('../../lib/logger');


const updateSession = async (body) => {
  if([body.user_id, body.video_id, body.covered, body.show_id].includes(null)){
    logger.error(`Not enough info! || $JSON.stringify(body)}`);
    return "Not enough info!";
  }
  else{
    const recordBody = {
        covered_percentage: body.covered,
        user_id: body.user_id,
        video_id: body.video_id,
        show_id: body.show_id
    }
    await db.user_player_session.upsertRecord(recordBody).catch((err)=>{
        console.log(err);
        logger.error(`${JSON.stringify(err) || $JSON.stringify(body)}`);
    })
    logger.info(`Succesfully Updated Sessions for user ID: ${body.user_id} & Player Id: ${body.video_id}`);
  }
}

const getDiscussion = (body) => {
    return {
      messages: ["Hello"]
    }
}

module.exports = {
  updateSession,
  getDiscussion,
}