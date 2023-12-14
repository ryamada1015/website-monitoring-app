const router = require('express').Router();
const TrackService = require("../services/TrackService");

router.post('/track', TrackService.trackStatusCode);
router.post('/rika', TrackService.rikaFunction);
router.post('/up-time', TrackService.checkUptime);
router.post('/response-time', TrackService.checkResponseTime);
router.post('/load-time', TrackService.checkLoadTime);
router.post('/network-activity', TrackService.checkNetworkActivity);
router.post('/cookies', TrackService.getCookies);
router.post('/check-for-changes', TrackService.checkForChanges);


// router.post
// router.put
// router.delete

module.exports = router;
