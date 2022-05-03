import fc from "fast-check";
import Datahandler from "../datahandler.js";

describe("Sort Tags, get_tags", function () {
    it(`When passed a single task without any tags, get_tags should
    return undefined.`, function () {
        fc.assert(
            fc.property(
                fc.date(),
                fc.base64String({minLength: 1}),
                fc.base64String({minLength: 1}),
                fc.base64String({minLength: 1}),
                function (dt, b, c, d) {

                    let tasks = ([
                        {
                            "due": dt,
                            "name": b,
                            "notes": c,
                            "tags": [],
                            "complete": false,
                            "_id": d
                        }
                    ]);

                    let tags = Datahandler.get_tags(tasks);
                    return tags === undefined;
                }
            )
        );
    });

    it(`When passed several tasks where none have tags, return should be
    undefined`, function () {
        fc.assert(
            fc.property(
                fc.date(),
                fc.base64String({minLength: 1}),
                fc.base64String({minLength: 1}),
                fc.base64String({minLength: 1}),
                function (dt, b, c, d) {

                    let tasks = ([
                        {
                            "due": dt,
                            "name": b,
                            "notes": c,
                            "tags": [],
                            "complete": false,
                            "_id": d
                        },
                        {
                            "due": dt,
                            "name": d,
                            "notes": b,
                            "tags": [],
                            "complete": false,
                            "_id": c
                        },
                        {
                            "due": dt,
                            "name": c,
                            "notes": c,
                            "tags": [],
                            "complete": false,
                            "_id": c
                        },
                        {
                            "due": dt,
                            "name": d,
                            "notes": b,
                            "tags": [],
                            "complete": false,
                            "_id": d
                        }
                    ]);

                    let tags = Datahandler.get_tags(tasks);
                    return tags === undefined;
                }
            )
        );
    });

    it(`When passed several tasks where only 1 has tags, those tags should be
    returned in an array.`, function () {
        fc.assert(
            fc.property(
                fc.date(),
                fc.base64String({minLength: 1}),
                fc.base64String({minLength: 1}),
                fc.base64String({minLength: 1}),
                function (dt, b, c, d) {

                    let tasks = ([
                        {
                            "due": dt,
                            "name": b,
                            "notes": c,
                            "tags": [b, c, d],
                            "complete": false,
                            "_id": d
                        },

                        {
                            "due": dt,
                            "name": c,
                            "notes": c,
                            "tags": [],
                            "complete": false,
                            "_id": d
                        },

                        {
                            "due": dt,
                            "name": d,
                            "notes": c,
                            "tags": [],
                            "complete": false,
                            "_id": b
                        }
                    ]);

                    let tags = Datahandler.get_tags(tasks);
                    let expected = [b, c, d];
                    return JSON.stringify(tags) === JSON.stringify(expected);
                }
            )
        );
    });

    it(`When passed several tasks where all have tags, returned array should
    contain each tag exactly once.`, function () {
        fc.assert(
            fc.property(
                fc.date(),
                fc.base64String({minLength: 1}),
                fc.base64String({minLength: 1}),
                fc.base64String({minLength: 1}),
                function (dt, b, c, d) {

                    let tasks = ([
                        {
                            "due": dt,
                            "name": b,
                            "notes": c,
                            "tags": [b, c],
                            "complete": false,
                            "_id": d
                        },

                        {
                            "due": dt,
                            "name": b,
                            "notes": d,
                            "tags": [c],
                            "complete": false,
                            "_id": c
                        },

                        {
                            "due": dt,
                            "name": d,
                            "notes": c,
                            "tags": [c, d],
                            "complete": false,
                            "_id": b
                        }
                    ]);

                    let tags = Array.from(Datahandler.get_tags(tasks));
                    let expected = [b, c, d];
                    return JSON.stringify(tags) === JSON.stringify(expected);
                }
            )
        );
    });
});

describe("Rank Tasks by Date, sort_tags", function () {
    it(`When passed a single task, it will be returned unchanged`, function () {
        fc.assert(
            fc.property(
                fc.date(),
                function (d) {
                    let task = ([
                        {
                            "due": d,
                            "name": "sample",
                            "notes": "sample-notes",
                            "tags": [],
                            "complete": false,
                            "_id": "sample-id"
                        }
                    ]);

                    return Datahandler.sort_tasks(task) === task;
                }
            )
        );
    });

    it(`When passed several tasks, the task with the smallest unix time value
    will be returned first`, function () {
        fc.assert(
            fc.property(
                fc.date(),
                fc.date(),
                fc.date(),
                fc.date(),
                function (d1, d2, d3, d4) {
                    let task = ([
                        {
                            "due": d1,
                            "name": "sample1",
                            "notes": "sample1-notes",
                            "tags": [],
                            "complete": false,
                            "_id": "sample1-id"
                        },
                        {
                            "due": d2,
                            "name": "sample2",
                            "notes": "sample2-notes",
                            "tags": [],
                            "complete": false,
                            "_id": "sample2-id"
                        },
                        {
                            "due": d3,
                            "name": "sample3",
                            "notes": "sample3-notes",
                            "tags": [],
                            "complete": false,
                            "_id": "sample3-id"
                        },
                        {
                            "due": d4,
                            "name": "sample4",
                            "notes": "sample4-notes",
                            "tags": [],
                            "complete": false,
                            "_id": "sample4-id"
                        }
                    ]);

                    let small_due = Math.min(d1, d2, d3, d4);
                    let first_task = Datahandler.sort_tasks(task)[0];

                    return first_task.due.getTime() === small_due;
                }
            )
        );
    });

    it(`When passed several tasks, the task with the largest unix time value
    will be returned last`, function () {
        fc.assert(
            fc.property(
                fc.date(),
                fc.date(),
                fc.date(),
                fc.date(),
                function (d1, d2, d3, d4) {
                    let task = ([
                        {
                            "due": d1,
                            "name": "sample1",
                            "notes": "sample1-notes",
                            "tags": [],
                            "complete": false,
                            "_id": "sample1-id"
                        },
                        {
                            "due": d2,
                            "name": "sample2",
                            "notes": "sample2-notes",
                            "tags": [],
                            "complete": false,
                            "_id": "sample2-id"
                        },
                        {
                            "due": d3,
                            "name": "sample3",
                            "notes": "sample3-notes",
                            "tags": [],
                            "complete": false,
                            "_id": "sample3-id"
                        },
                        {
                            "due": d4,
                            "name": "sample4",
                            "notes": "sample4-notes",
                            "tags": [],
                            "complete": false,
                            "_id": "sample4-id"
                        }
                    ]);

                    let big_due = Math.max(d1, d2, d3, d4);
                    let last_task = Datahandler.sort_tasks(task).pop();

                    return last_task.due.getTime() === big_due;
                }
            )
        );
    });
});

describe("Rank Tasks by Tags, sort_tags", function () {
    it(`When passed a single task, it will be returned unchanged`, function () {
        fc.assert(
            fc.property(
                fc.base64String({minLength: 1}),
                fc.base64String({minLength: 1}),
                function (a, b) {
                    let task = ([
                        {
                            "due": "000000",
                            "name": "sample",
                            "notes": "sample-notes",
                            "tags": [a, b],
                            "complete": false,
                            "_id": "sample-id"
                        }
                    ]);

                    return Datahandler.sort_tasks(task, "tags") === task;
                }
            )
        );
    });

    it(`When passed several tasks, the task with the most tags will be returned
    first`, function () {
        fc.assert(
            fc.property(
                fc.base64String({minLength: 1}),
                fc.base64String({minLength: 1}),
                fc.base64String({minLength: 1}),
                fc.base64String({minLength: 1}),
                function (a, b, c, d) {
                    let maxtag = [a, b, c, d];
                    let sometag = [b, a];
                    let onetag = [b];
                    let notag = [];

                    let task = ([
                        {
                            "due": "00001",
                            "name": "sample1",
                            "notes": "sample1-notes",
                            "tags": maxtag,
                            "complete": false,
                            "_id": "sample1-id"
                        },
                        {
                            "due": "00002",
                            "name": "sample2",
                            "notes": "sample2-notes",
                            "tags": sometag,
                            "complete": false,
                            "_id": "sample2-id"
                        },
                        {
                            "due": "00003",
                            "name": "sample3",
                            "notes": "sample3-notes",
                            "tags": onetag,
                            "complete": false,
                            "_id": "sample3-id"
                        },
                        {
                            "due": "00004",
                            "name": "sample4",
                            "notes": "sample4-notes",
                            "tags": notag,
                            "complete": false,
                            "_id": "sample4-id"
                        }
                    ]);

                    let first_task = Datahandler.sort_tasks(task, "tags")[0];

                    return first_task.tags === maxtag;
                }
            )
        );
    });

    it(`When passed several tasks, the task with the fewest tags will be
    returned last`, function () {
        fc.assert(
            fc.property(
                fc.base64String({minLength: 1}),
                fc.base64String({minLength: 1}),
                fc.base64String({minLength: 1}),
                fc.base64String({minLength: 1}),
                function (a, b, c, d) {
                    let maxtag = [a, b, c, d];
                    let sometag = [b, a];
                    let onetag = [b];
                    let notag = [];

                    let task = ([
                        {
                            "due": "00001",
                            "name": "sample1",
                            "notes": "sample1-notes",
                            "tags": maxtag,
                            "complete": false,
                            "_id": "sample1-id"
                        },
                        {
                            "due": "00002",
                            "name": "sample2",
                            "notes": "sample2-notes",
                            "tags": sometag,
                            "complete": false,
                            "_id": "sample2-id"
                        },
                        {
                            "due": "00003",
                            "name": "sample3",
                            "notes": "sample3-notes",
                            "tags": onetag,
                            "complete": false,
                            "_id": "sample3-id"
                        },
                        {
                            "due": "00004",
                            "name": "sample4",
                            "notes": "sample4-notes",
                            "tags": notag,
                            "complete": false,
                            "_id": "sample4-id"
                        }
                    ]);

                    let last_task = Datahandler.sort_tasks(task, "tags").pop();

                    return last_task.tags === notag;
                }
            )
        );
    });
});
