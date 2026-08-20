const mongoose = require("mongoose");
const Job = require("../models/Job");

// Dashboard analytics
const getAnalytics = async (req, res) => {
    try {
        const userId = req.userId;

        const totalJobs = await Job.countDocuments({
            user: userId
        });

        const statusCounts = await Job.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: {
                        $sum: 1
                    }
                }
            }
        ]);

        const monthlyApplications = await Job.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    appliedDate: {
                        $exists: true,
                        $ne: null
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: {
                            $year: "$appliedDate"
                        },
                        month: {
                            $month: "$appliedDate"
                        }
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);

        // Calculate success rates
const applied = await Job.countDocuments({
    user: userId,
    status: {
        $in: ["Applied", "Screening", "Interview", "Offer", "Rejected"]
    }
});

const interviews = await Job.countDocuments({
    user: userId,
    status: "Interview"
});

const offers = await Job.countDocuments({
    user: userId,
    status: "Offer"
});

const interviewRate = applied
    ? Math.round((interviews / applied) * 100)
    : 0;

const offerRate = applied
    ? Math.round((offers / applied) * 100)
    : 0;

        const analytics = {
         totalJobs,
         wishlist: 0,
         applied: 0,
         screening: 0,
         interview: 0,
         offer: 0,
         rejected: 0,
         monthlyApplications,
         interviewRate,
          offerRate
        };
        
        statusCounts.forEach((item) => {
            const key = item._id.toLowerCase();
            analytics[key] = item.count;
        });

        res.status(200).json({
            analytics
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch analytics",
            error: error.message
        });
    }
};

module.exports = {
    getAnalytics
};