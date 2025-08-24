// MongoDB migration script (run in MongoDB shell or via script)
db.tasks.updateMany(
    { reminder: { $type: "string" } },
    [
        {
            $set: {
                reminder: {
                    $cond: {
                        if: { $ne: ["$reminder", null] },
                        then: { $dateFromString: { dateString: "$reminder" } },
                        else: null
                    }
                }
            }
        }
    ]
)