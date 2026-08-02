"use strict";


/* =========================================
   LIFETRACK - DASHBOARD.JS
   PART 1
   STORAGE + USER + CALENDAR
========================================= */


/* =========================================
   STORAGE KEYS
========================================= */

const HABIT_STORAGE =
    "lifetrack_habits_v4";

const DATA_STORAGE =
    "lifetrack_data_v4";

const THEME_STORAGE =
    "lifetrack_theme_v4";

const USER_STORAGE =
    "lifetrack_username";

const REMINDER_STORAGE =
    "lifetrack_daily_reminder_v1";

const REMINDER_DATE_STORAGE =
    "lifetrack_daily_reminder_date_v1";

const REMINDER_LOCK_STORAGE =
    "lifetrack_daily_reminder_lock_v1";

let diaryLocked = false;


/* =========================================
   DEFAULT HABITS
========================================= */

const DEFAULT_HABITS = [

    {
        id: "exercise",
        name: "Exercise",
        goal: 31
    },

    {
        id: "study",
        name: "Study",
        goal: 31
    }

];


/* =========================================
   HTML ELEMENTS
========================================= */

const monthSelect =
    document.getElementById(
        "monthSelect"
    );

const yearSelect =
    document.getElementById(
        "yearSelect"
    );

const calendarHead =
    document.getElementById(
        "calendarHead"
    );

const habitBody =
    document.getElementById(
        "habitBody"
    );

const pageTitle =
    document.getElementById(
        "pageTitle"
    );

const userName =
    document.getElementById(
        "userName"
    );

const profileLetter =
    document.getElementById(
        "profileLetter"
    );

const habitCount =
    document.getElementById(
        "habitCount"
    );

const completedCount =
    document.getElementById(
        "completedCount"
    );

const progressPercent =
    document.getElementById(
        "progressPercent"
    );

const progressBar =
    document.getElementById(
        "progressBar"
    );

const progressStatus =
    document.getElementById(
        "progressStatus"
    );

const newHabitInput =
    document.getElementById(
        "newHabitInput"
    );

const addHabitBtn =
    document.getElementById(
        "addHabitBtn"
    );

const habitManageList =
    document.getElementById(
        "habitManageList"
    );

const goalAnalysis =
    document.getElementById(
        "goalAnalysis"
    );

const completionChart =
    document.getElementById(
        "completionChart"
    );

const streakList =
    document.getElementById(
        "streakList"
    );

const reminderInput =
    document.getElementById(
        "reminderInput"
    );

const reminderClearBtn =
    document.getElementById(
        "reminderClearBtn"
    );

const goalPageList =
    document.getElementById(
        "goalPageList"
    );

const analyticsSummary =
    document.getElementById(
        "analyticsSummary"
    );

const jumpTodayBtn =
    document.getElementById(
        "jumpTodayBtn"
    );

const resetBtn =
    document.getElementById(
        "resetBtn"
    );

const themeToggle =
    document.getElementById(
        "themeToggle"
    );

const analysisPanel =
    document.querySelector(
        ".analysis-panel"
    );

const performancePanel =
    completionChart

    ?

    completionChart.closest(
        ".panel"
    )

    :

    null;

let goalAnalysisView =
    "rings";

let completionChartView =
    "graphic";


/* =========================================
   LOAD STORAGE
========================================= */

function loadStorage(
    key,
    fallback
) {

    try {

        const saved =
            localStorage.getItem(
                key
            );

        if (!saved) {

            return fallback;

        }

        return JSON.parse(
            saved
        );

    }

    catch (error) {

        return fallback;

    }

}


/* =========================================
   HABITS + DATA
========================================= */

let habits =
    loadStorage(
        HABIT_STORAGE,
        DEFAULT_HABITS
    );

let habitData =
    loadStorage(
        DATA_STORAGE,
        {}
    );


if (
    !Array.isArray(
        habits
    )
) {

    habits =
        [...DEFAULT_HABITS];

}


/* =========================================
   SAVE DATA
========================================= */

function saveData() {

    localStorage.setItem(

        HABIT_STORAGE,

        JSON.stringify(
            habits
        )

    );


    localStorage.setItem(

        DATA_STORAGE,

        JSON.stringify(
            habitData
        )

    );

}


/* =========================================
   SAFE HTML
========================================= */

function escapeHTML(
    value
) {

    const element =
        document.createElement(
            "div"
        );

    element.textContent =
        String(
            value
        );

    return element.innerHTML;

}


/* =========================================
   LOAD USER
========================================= */

function loadUser() {

    const name =

        localStorage.getItem(
            USER_STORAGE
        )

        ||

        "User";


    if (userName) {

        userName.textContent =
            name;

    }


    if (profileLetter) {

        profileLetter.textContent =

            name
            .charAt(0)
            .toUpperCase();

    }

}


function getTodayKey() {

    const today =
        new Date();


    return (
        today.getFullYear()
        +
        "-"
        +
        String(
            today.getMonth() + 1
        )
        .padStart(
            2,
            "0"
        )
        +
        "-"
        +
        String(
            today.getDate()
        )
        .padStart(
            2,
            "0"
        )
    );

}


function loadDiaryLock() {

    diaryLocked =
        localStorage.getItem(
            REMINDER_LOCK_STORAGE
        ) ===
        "true";

}


function updateDiaryLockButton() {

    const diaryLockBtn =
        document.getElementById(
            "diaryLockBtn"
        );

    if (!diaryLockBtn || !reminderInput) {

        return;

    }

    diaryLockBtn.classList.toggle(
        "locked",
        diaryLocked
    );

    diaryLockBtn.innerHTML =
        diaryLocked
        ?
        `🔒 Locked`
        :
        `🔓 Unlock`;

    reminderInput.disabled =
        diaryLocked;

    reminderInput.classList.toggle(
        "locked",
        diaryLocked
    );

}


function loadReminder() {

    if (!reminderInput) {

        return;

    }

    loadDiaryLock();

    const savedDate =
        localStorage.getItem(
            REMINDER_DATE_STORAGE
        );

    const savedText =
        localStorage.getItem(
            REMINDER_STORAGE
        )
        ||
        "";

    if (
        !diaryLocked
        &&
        savedDate !==
        getTodayKey()
    ) {

        clearReminder();

    }
    else {

        reminderInput.value =
            savedText;

    }

    updateDiaryLockButton();

}


function saveReminder() {

    if (!reminderInput) {

        return;

    }


    const reminderText =
        reminderInput.value
        .trim();


    if (reminderText) {

        localStorage.setItem(
            REMINDER_STORAGE,
            reminderText
        );

    }

    else {

        localStorage.removeItem(
            REMINDER_STORAGE
        );

    }

    localStorage.setItem(
        REMINDER_DATE_STORAGE,
        getTodayKey()
    );

}


function clearReminder() {

    if (!reminderInput) {

        return;

    }


    reminderInput.value =
        "";


    localStorage.removeItem(
        REMINDER_STORAGE
    );

    localStorage.setItem(
        REMINDER_DATE_STORAGE,
        getTodayKey()
    );

}


function toggleDiaryLock() {

    diaryLocked =
        !diaryLocked;

    localStorage.setItem(
        REMINDER_LOCK_STORAGE,
        diaryLocked
            ?
            "true"
            :
            "false"
    );

    if (
        diaryLocked
        &&
        !reminderInput.value.trim()
    ) {

        reminderInput.value = "";

    }

    updateDiaryLockButton();

}


/* =========================================
   SET CURRENT MONTH + YEAR
========================================= */

function setCurrentDate() {

    const today =
        new Date();


    if (monthSelect) {

        monthSelect.selectedIndex =
            today.getMonth();

    }


    if (yearSelect) {

        const currentYear =
            today.getFullYear();


        let yearExists =
            false;


        Array
        .from(
            yearSelect.options
        )
        .forEach(

            function (
                option
            ) {

                if (

                    Number(
                        option.value
                    )

                    ===

                    currentYear

                ) {

                    yearExists =
                        true;

                }

            }

        );


        if (!yearExists) {

            const option =

                document.createElement(
                    "option"
                );


            option.value =
                currentYear;


            option.textContent =
                currentYear;


            yearSelect.appendChild(
                option
            );

        }


        yearSelect.value =
            String(
                currentYear
            );

    }

}


/* =========================================
   GET CALENDAR
========================================= */

function getCalendar() {

    const month =

        monthSelect

        ?

        monthSelect.selectedIndex

        :

        new Date()
        .getMonth();


    const year =

        yearSelect

        ?

        Number(
            yearSelect.value
        )

        :

        new Date()
        .getFullYear();


    const totalDays =

        new Date(

            year,

            month + 1,

            0

        )
        .getDate();


    const monthName =

        monthSelect

        ?

        monthSelect
        .options[
            month
        ]
        .text

        :

        "January";


    return {

        month:
            month,

        year:
            year,

        totalDays:
            totalDays,

        monthName:
            monthName

    };

}


/* =========================================
   MONTH DATA KEY
========================================= */

function getMonthKey() {

    const calendar =
        getCalendar();


    return (

        calendar.year

        +

        "-"

        +

        String(

            calendar.month + 1

        )
        .padStart(

            2,

            "0"

        )

    );

}


/* =========================================
   HABIT DATA KEY
========================================= */

function getDataKey(
    habitId,
    day
) {

    return (

        getMonthKey()

        +

        "|"

        +

        habitId

        +

        "|"

        +

        day

    );

}


/* =========================================
   CHECK TODAY
========================================= */

function isToday(
    day
) {

    const today =
        new Date();

    const calendar =
        getCalendar();


    return (

        today.getFullYear()

        ===

        calendar.year

        &&

        today.getMonth()

        ===

        calendar.month

        &&

        today.getDate()

        ===

        day

    );

}


/* =========================================
   CALENDAR HEADER
========================================= */

function renderCalendarHeader() {

    if (!calendarHead) {

        return;

    }


    const calendar =
        getCalendar();


    if (pageTitle) {

        pageTitle.textContent =

            calendar.monthName

            +

            " "

            +

            calendar.year

            +

            " Progress";

    }


    let weekHTML = `

        <tr>

            <th
                class="habit-heading"
                rowspan="2"
            >

                HABITS

            </th>

    `;


    let day = 1;

    let weekNumber = 1;


    while (

        day

        <=

        calendar.totalDays

    ) {

        const date =

            new Date(

                calendar.year,

                calendar.month,

                day

            );


        const weekday =
            date.getDay();


        const daysUntilSaturday =

            7

            -

            weekday;


        const span =

            Math.min(

                daysUntilSaturday,

                calendar.totalDays

                -

                day

                +

                1

            );


        weekHTML += `

            <th
                class="week-heading"
                colspan="${span}"
            >

                WEEK ${weekNumber}

            </th>

        `;


        day +=
            span;


        weekNumber++;

    }


    weekHTML += `

        </tr>

    `;


    let dayHTML = `

        <tr
            class="days-row"
        >

    `;


    for (

        let currentDay = 1;

        currentDay <=
        calendar.totalDays;

        currentDay++

    ) {

        const date =

            new Date(

                calendar.year,

                calendar.month,

                currentDay

            );


        const dayName =

            date
            .toLocaleDateString(

                "en-US",

                {

                    weekday:
                        "short"

                }

            );


        const todayClass =

            isToday(
                currentDay
            )

            ?

            " today-cell"

            :

            "";


        dayHTML += `

            <th
                class="calendar-day${todayClass}"
            >

                <span
                    class="day-name"
                >

                    ${dayName}

                </span>

                <span
                    class="date-number"
                >

                    ${currentDay}

                </span>

            </th>

        `;

    }


    dayHTML += `

        </tr>

    `;


    calendarHead.innerHTML =

        weekHTML

        +

        dayHTML;

}


/* =========================================
   PART 1 END
========================================= */
/* =========================================
   PART 2
   HABIT TRACKER + EDIT + REORDER
========================================= */


/* =========================================
   HABIT REORDER SYSTEM
========================================= */

let draggedHabitId = null;


function moveHabit(
    fromId,
    toId
) {

    const fromIndex =
        habits.findIndex(

            habit =>

            habit.id ===
            fromId

        );


    const toIndex =
        habits.findIndex(

            habit =>

            habit.id ===
            toId

        );


    if (

        fromIndex === -1

        ||

        toIndex === -1

        ||

        fromIndex === toIndex

    ) {

        return;

    }


    const movedHabit =

        habits.splice(

            fromIndex,

            1

        )[0];


    habits.splice(

        toIndex,

        0,

        movedHabit

    );


    saveData();

    renderAll();

}


/* =========================================
   EDIT HABIT NAME
========================================= */

function startHabitEdit(
    habit,
    nameCell
) {

    const input =

        document.createElement(
            "input"
        );


    input.type =
        "text";


    input.value =
        habit.name;


    input.maxLength =
        35;


    input.className =
        "habit-edit-input";


    nameCell.innerHTML =
        "";


    nameCell.appendChild(
        input
    );


    input.focus();

    input.select();


    let editFinished =
        false;


    function finishEdit(
        shouldSave
    ) {

        if (
            editFinished
        ) {

            return;

        }


        editFinished =
            true;


        const newName =

            input.value
            .trim();


        if (

            shouldSave

            &&

            newName

        ) {

            habit.name =
                newName;


            saveData();

        }


        renderAll();

    }


    input.addEventListener(

        "keydown",

        function (
            event
        ) {

            if (

                event.key ===
                "Enter"

            ) {

                event.preventDefault();

                finishEdit(
                    true
                );

            }


            if (

                event.key ===
                "Escape"

            ) {

                event.preventDefault();

                finishEdit(
                    false
                );

            }

        }

    );


    input.addEventListener(

        "blur",

        function () {

            finishEdit(
                true
            );

        }

    );

}


/* =========================================
   RENDER HABIT TRACKER
========================================= */

function renderHabitTracker() {

    if (
        !habitBody
    ) {

        return;

    }


    const calendar =
        getCalendar();


    habitBody.innerHTML =
        "";


    if (
        habits.length === 0
    ) {

        const emptyRow =

            document.createElement(
                "tr"
            );


        const emptyCell =

            document.createElement(
                "td"
            );


        emptyCell.textContent =

            "Add a habit from the Habits page.";


        emptyCell.colSpan =

            calendar.totalDays
            +
            1;


        emptyRow.appendChild(
            emptyCell
        );


        habitBody.appendChild(
            emptyRow
        );


        return;

    }


    habits.forEach(

        function (
            habit
        ) {

            const row =

                document.createElement(
                    "tr"
                );


            row.draggable =
                true;


            row.dataset.habitId =
                habit.id;


            /* =========================
               DRAG START
            ========================= */

            row.addEventListener(

                "dragstart",

                function (
                    event
                ) {

                    draggedHabitId =
                        habit.id;


                    row.classList.add(
                        "dragging"
                    );


                    if (
                        event.dataTransfer
                    ) {

                        event.dataTransfer
                        .effectAllowed =
                            "move";


                        event.dataTransfer
                        .setData(

                            "text/plain",

                            habit.id

                        );

                    }

                }

            );


            /* =========================
               DRAG END
            ========================= */

            row.addEventListener(

                "dragend",

                function () {

                    row.classList.remove(
                        "dragging"
                    );


                    draggedHabitId =
                        null;

                }

            );


            /* =========================
               DRAG OVER
            ========================= */

            row.addEventListener(

                "dragover",

                function (
                    event
                ) {

                    event.preventDefault();


                    if (
                        event.dataTransfer
                    ) {

                        event.dataTransfer
                        .dropEffect =
                            "move";

                    }

                }

            );


            /* =========================
               DROP
            ========================= */

            row.addEventListener(

                "drop",

                function (
                    event
                ) {

                    event.preventDefault();


                    let sourceId =
                        draggedHabitId;


                    if (

                        !sourceId

                        &&

                        event.dataTransfer

                    ) {

                        sourceId =

                            event.dataTransfer
                            .getData(

                                "text/plain"

                            );

                    }


                    if (

                        sourceId

                        &&

                        sourceId !==
                        habit.id

                    ) {

                        moveHabit(

                            sourceId,

                            habit.id

                        );

                    }

                }

            );


            /* =========================
               HABIT NAME
            ========================= */

            const nameCell =

                document.createElement(
                    "td"
                );


            nameCell.className =
                "habit-name";


            const nameText =

                document.createElement(
                    "span"
                );


            nameText.textContent =
                habit.name;


            nameText.title =
                "Double-click to edit";


            nameText.addEventListener(

                "dblclick",

                function (
                    event
                ) {

                    event.preventDefault();

                    event.stopPropagation();


                    startHabitEdit(

                        habit,

                        nameCell

                    );

                }

            );


            nameCell.appendChild(
                nameText
            );


            row.appendChild(
                nameCell
            );


            /* =========================
               DATE CHECKBOXES
            ========================= */

            for (

                let day = 1;

                day <=
                calendar.totalDays;

                day++

            ) {

                const cell =

                    document.createElement(
                        "td"
                    );


                cell.className =
                    "habit-cell";


                if (
                    isToday(
                        day
                    )
                ) {

                    cell.classList.add(
                        "today-cell"
                    );

                }


                const button =

                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.className =
                    "habit-check";


                const dataKey =

                    getDataKey(

                        habit.id,

                        day

                    );


                if (
                    habitData[
                        dataKey
                    ]
                ) {

                    button.classList.add(
                        "checked"
                    );


                    button.textContent =
                        "✓";

                }


                button.addEventListener(

                    "click",

                    function (
                        event
                    ) {

                        event.preventDefault();

                        event.stopPropagation();


                        if (

                            habitData[
                                dataKey
                            ]

                        ) {

                            delete habitData[
                                dataKey
                            ];

                        }

                        else {

                            habitData[
                                dataKey
                            ] =
                                true;

                        }


                        saveData();

                        renderAll();

                    }

                );


                cell.appendChild(
                    button
                );


                row.appendChild(
                    cell
                );

            }


                    habitBody.appendChild(
                row
            );

        }

    );

}  


/* =========================================
   ADD HABIT
========================================= */

function addHabit() {

    if (
        !newHabitInput
    ) {

        return;

    }


    const habitName =

        newHabitInput.value
        .trim();


    if (
        !habitName
    ) {

        newHabitInput.focus();

        return;

    }


    habits.push({

        id:

            "habit_"

            +

            Date.now()

            +

            "_"

            +

            Math.random()
            .toString(36)
            .slice(2),


        name:

            habitName,


        goal:

            31

    });


    newHabitInput.value =
        "";


    saveData();

    renderAll();

}


/* =========================================
   REMOVE HABIT
========================================= */

function removeHabit(
    habitId
) {

    habits =

        habits.filter(

            habit =>

            habit.id !==
            habitId

        );


    Object.keys(
        habitData
    )
    .forEach(

        function (
            key
        ) {

            if (

                key.includes(

                    "|"

                    +

                    habitId

                    +

                    "|"

                )

            ) {

                delete habitData[
                    key
                ];

            }

        }

    );


    saveData();

    renderAll();

}


/* =========================================
   PART 2 END
========================================= */
/* =========================================
   PART 3
   HABIT MANAGEMENT + ANALYTICS + FINAL
========================================= */


/* =========================================
   HABIT MANAGEMENT PAGE
========================================= */

function renderHabitManagement() {

    if (!habitManageList) {

        return;

    }


    habitManageList.innerHTML =
        "";


    if (habits.length === 0) {

        habitManageList.innerHTML =
            "<p>No habits added yet.</p>";

        return;

    }


    habits.forEach(

        function (habit) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "manage-item";


            item.draggable =
                true;


            item.dataset.habitId =
                habit.id;


            /* DRAG START */

            item.addEventListener(

                "dragstart",

                function (event) {

                    draggedHabitId =
                        habit.id;


                    item.classList.add(
                        "dragging"
                    );


                    if (
                        event.dataTransfer
                    ) {

                        event.dataTransfer
                        .effectAllowed =
                            "move";


                        event.dataTransfer
                        .setData(

                            "text/plain",

                            habit.id

                        );

                    }

                }

            );


            /* DRAG END */

            item.addEventListener(

                "dragend",

                function () {

                    item.classList.remove(
                        "dragging"
                    );


                    draggedHabitId =
                        null;

                }

            );


            /* DRAG OVER */

            item.addEventListener(

                "dragover",

                function (event) {

                    event.preventDefault();

                }

            );


            /* DROP */

            item.addEventListener(

                "drop",

                function (event) {

                    event.preventDefault();


                    let sourceId =
                        draggedHabitId;


                    if (

                        !sourceId

                        &&

                        event.dataTransfer

                    ) {

                        sourceId =

                            event.dataTransfer
                            .getData(
                                "text/plain"
                            );

                    }


                    if (

                        sourceId

                        &&

                        sourceId !==
                        habit.id

                    ) {

                        moveHabit(

                            sourceId,

                            habit.id

                        );

                    }

                }

            );


            /* HABIT DETAILS */

            const details =
                document.createElement(
                    "div"
                );


            details.className =
                "manage-details";


            const title =
                document.createElement(
                    "strong"
                );


            title.textContent =
                habit.name;


            title.title =
                "Double-click to edit";


            title.addEventListener(

                "dblclick",

                function (event) {

                    event.preventDefault();

                    event.stopPropagation();


                    const input =
                        document.createElement(
                            "input"
                        );


                    input.type =
                        "text";


                    input.value =
                        habit.name;


                    input.maxLength =
                        35;


                    input.className =
                        "manage-edit-input";


                    details.replaceChild(

                        input,

                        title

                    );


                    input.focus();

                    input.select();


                    let finished =
                        false;


                    function finishNameEdit(
                        shouldSave
                    ) {

                        if (
                            finished
                        ) {

                            return;

                        }


                        finished =
                            true;


                        const value =

                            input.value
                            .trim();


                        if (

                            shouldSave

                            &&

                            value

                        ) {

                            habit.name =
                                value;


                            saveData();

                        }


                        renderAll();

                    }


                    input.addEventListener(

                        "keydown",

                        function (keyEvent) {

                            if (

                                keyEvent.key ===
                                "Enter"

                            ) {

                                keyEvent.preventDefault();

                                finishNameEdit(
                                    true
                                );

                            }


                            if (

                                keyEvent.key ===
                                "Escape"

                            ) {

                                keyEvent.preventDefault();

                                finishNameEdit(
                                    false
                                );

                            }

                        }

                    );


                    input.addEventListener(

                        "blur",

                        function () {

                            finishNameEdit(
                                true
                            );

                        }

                    );

                }

            );


            const goalText =
                document.createElement(
                    "small"
                );


            goalText.textContent =

                "Monthly goal: "

                +

                habit.goal

                +

                " days";


            details.appendChild(
                title
            );


            details.appendChild(
                goalText
            );


            /* CONTROLS */

            const controls =
                document.createElement(
                    "div"
                );


            controls.className =
                "manage-controls";


            const goalInput =
                document.createElement(
                    "input"
                );


            goalInput.type =
                "number";


            goalInput.min =
                "1";


            goalInput.max =
                "31";


            goalInput.value =
                habit.goal;


            goalInput.className =
                "goal-input";


            goalInput.addEventListener(

                "change",

                function () {

                    let value =

                        Number(
                            goalInput.value
                        );


                    if (
                        !Number.isFinite(
                            value
                        )
                    ) {

                        value =
                            1;

                    }


                    habit.goal =

                        Math.max(

                            1,

                            Math.min(

                                31,

                                Math.round(
                                    value
                                )

                            )

                        );


                    saveData();

                    renderAll();

                }

            );


            const removeButton =
                document.createElement(
                    "button"
                );


            removeButton.type =
                "button";


            removeButton.className =
                "remove-habit";


            removeButton.textContent =
                "Remove";


            removeButton.addEventListener(

                "click",

                function (event) {

                    event.preventDefault();

                    event.stopPropagation();


                    removeHabit(
                        habit.id
                    );

                }

            );


            controls.appendChild(
                goalInput
            );


            controls.appendChild(
                removeButton
            );


            item.appendChild(
                details
            );


            item.appendChild(
                controls
            );


            habitManageList.appendChild(
                item
            );

        }

    );

}


/* =========================================
   COMPLETION CALCULATIONS
========================================= */

function getHabitCompleted(
    habit
) {

    const calendar =
        getCalendar();


    let completed =
        0;


    for (

        let day = 1;

        day <=
        calendar.totalDays;

        day++

    ) {

        const key =

            getDataKey(

                habit.id,

                day

            );


        if (
            habitData[key]
        ) {

            completed++;

        }

    }


    return completed;

}


function getCompletedTotal() {

    let total =
        0;


    habits.forEach(

        function (habit) {

            total +=

                getHabitCompleted(
                    habit
                );

        }

    );


    return total;

}


/* =========================================
   TOP STATISTICS
========================================= */

function getTodayCompleted() {

    const todayDay =
        new Date().getDate();

    let completed =
        0;


    habits.forEach(

        function (habit) {

            const key =

                getDataKey(

                    habit.id,

                    todayDay

                );


            if (
                habitData[key]
            ) {

                completed++;

            }

        }

    );


    return completed;

}


function renderStats() {

    const completed =
        getTodayCompleted();


    const possible =
        habits.length;


    const percentage =

        possible > 0

        ?

        Math.round(

            completed

            /

            possible

            *

            100

        )

        :

        0;


    if (habitCount) {

        habitCount.textContent =
            habits.length;

    }


    if (completedCount) {

        completedCount.textContent =
            completed > 0

            ?

            completed

            :

            0;

    }


    if (progressPercent) {

        progressPercent.textContent =

            percentage

            +

            "%";

    }


    if (progressBar) {

        progressBar.style.width =

            percentage

            +

            "%";

    }


    if (progressStatus) {

        const statusText =

            possible > 0

            ?

            `${completed} of ${possible} habits done today`

            :

            "No habits added yet";


        progressStatus.textContent =
            statusText;

    }

}


/* =========================================
   GOAL ANALYSIS
========================================= */

function toggleGoalAnalysisView() {

    goalAnalysisView =
        goalAnalysisView ===
        "rings"

        ?

        "bars"

        :

        "rings";

    renderGoalAnalysis();

}


function toggleDailyCompletionView() {

    completionChartView =
        completionChartView ===
        "graphic"

        ?

        "simple"

        :

        "graphic";

    renderDailyCompletion();

}


function renderGoalAnalysis() {

    if (!goalAnalysis) {

        return;

    }


    goalAnalysis.innerHTML =
        "";


    habits.forEach(

        function (habit) {

            const completed =

                getHabitCompleted(
                    habit
                );


            const percentage =

                habit.goal > 0

                ?

                Math.min(

                    100,

                    Math.round(

                        completed

                        /

                        habit.goal

                        *

                        100

                    )

                )

                :

                0;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                goalAnalysisView ===
                "bars"

                ?

                "goal-analysis-item goal-analysis-item-bar"

                :

                "goal-analysis-item";


            item.innerHTML =
                goalAnalysisView ===
                "bars"

                ?

                `

                    <div class="goal-analysis-text">

                        <strong>

                            ${escapeHTML(
                                habit.name
                            )}

                        </strong>

                        <span>

                            ${completed}
                            /
                            ${habit.goal}

                        </span>

                    </div>

                    <div class="goal-mini-bar">

                        <span
                            style="width: ${percentage}%;"
                        ></span>

                    </div>

                `

                :

                `

                    <div class="goal-analysis-text">

                        <strong>

                            ${escapeHTML(
                                habit.name
                            )}

                        </strong>

                        <span>

                            ${completed}
                            /
                            ${habit.goal}

                        </span>

                    </div>

                    <div
                        class="goal-progress-ring"
                        style="--percent: ${percentage};"
                    >

                        <span>${percentage}%</span>

                    </div>

                `;


            goalAnalysis.appendChild(
                item
            );

        }

    );

}


/* =========================================
   DAILY COMPLETION CHART
========================================= */

if (analysisPanel) {

    analysisPanel.addEventListener(
        "click",
        function () {

            toggleGoalAnalysisView();

        }
    );

}


if (performancePanel) {

    performancePanel.addEventListener(
        "click",
        function (event) {

            if (
                event.target.closest(
                    ".completion-chart"
                )
            ) {

                toggleDailyCompletionView();

            }

        }
    );

}


function renderDailyCompletion() {

    if (!completionChart) {

        return;

    }


    const calendar =
        getCalendar();


    const values = [];

    let maxValue = 0;


    for (

        let day = 1;

        day <=
        calendar.totalDays;

        day++

    ) {

        let completed =
            0;


        habits.forEach(

            function (habit) {

                const key =

                    getDataKey(

                        habit.id,

                        day

                    );


                if (
                    habitData[key]
                ) {

                    completed++;

                }

            }

        );


        const percentage =

            habits.length > 0

            ?

            Math.round(

                completed

                /

                habits.length

                *

                100

            )

            :

            0;


        values.push({
            day,
            percentage
        });

        maxValue =
            Math.max(
                maxValue,
                percentage
            );

    }


    const safeMax =
        Math.max(
            100,
            maxValue
        );

    const width = 100;
    const height = 100;
    const padding = 10;

    const step =
        values.length > 1

            ?

            (width - padding * 2)
            /
            (values.length - 1)

            :

            width / 2;


    const points =
        values.map(
            function (item, index) {

                const x =
                    padding +
                    index * step;

                const y =
                    height -
                    padding -
                    (item.percentage / safeMax) *
                    (height - padding * 2);

                return {
                    x,
                    y,
                    day: item.day,
                    percentage: item.percentage
                };

            }
        );


    const linePoints =
        points.map(
            function (point) {

                return `${point.x},${point.y}`;

            }
        ).join(" ");


    const areaPath =
        `M ${points[0].x},${height - padding} ` +
        points.map(
            function (point) {

                return `L ${point.x},${point.y}`;

            }
        ).join(" ") +
        ` L ${points[points.length - 1].x},${height - padding} Z`;


    const linePath =
        `M ${points.map(function (point) {
            return `${point.x},${point.y}`;
        }).join(" L ")}`;


    const lastValue =
        points[points.length - 1];

    const dateLabelDays = [
        1,
        Math.ceil(calendar.totalDays / 2),
        calendar.totalDays
    ];

    const dateLabelPoints =
        points.filter(
            function (point) {

                return dateLabelDays.includes(
                    point.day
                );

            }
        );


    const isSimpleView =
        completionChartView ===
        "simple";


    completionChart.innerHTML = `

        <div class="chart-shell${isSimpleView ? " chart-shell-simple" : ""}">

            <div class="chart-metrics">

                <div>

                    <span class="metric-label">Peak</span>

                    <strong>${Math.max(...values.map(function (item) {
                        return item.percentage;
                    }))}%</strong>

                </div>

                <div>

                    <span class="metric-label">Overall</span>

                    <strong>${values.length > 0 ? Math.round(values.reduce(function (sum, item) {
                        return sum + item.percentage;
                    }, 0) / values.length) : 0}%</strong>

                </div>

            </div>

            <svg class="chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none">

                <defs>

                    <linearGradient id="completionGradient" x1="0%" y1="0%" x2="0%" y2="100%">

                        <stop offset="0%" stop-color="#4f8dff" stop-opacity="0.26"></stop>

                        <stop offset="100%" stop-color="#1761df" stop-opacity="0.05"></stop>

                    </linearGradient>

                    <linearGradient id="completionStroke" x1="0%" y1="0%" x2="100%" y2="0%">

                        <stop offset="0%" stop-color="#1761df"></stop>

                        <stop offset="100%" stop-color="#6ba4ff"></stop>

                    </linearGradient>

                    <pattern id="chartTexture" width="8" height="8" patternUnits="userSpaceOnUse">

                        <path d="M 0 8 L 8 0" stroke="rgba(255,255,255,0.28)" stroke-width="0.35"></path>

                        <path d="M 0 0 L 8 8" stroke="rgba(255,255,255,0.15)" stroke-width="0.25"></path>

                    </pattern>

                </defs>

                ${isSimpleView ? "" : `<rect x="0" y="0" width="100" height="100" rx="4" fill="url(#chartTexture)"></rect>`}

                <line class="grid-line" x1="10" y1="90" x2="90" y2="90"></line>

                <line class="grid-line" x1="10" y1="70" x2="90" y2="70"></line>

                <line class="grid-line" x1="10" y1="50" x2="90" y2="50"></line>

                <line class="grid-line" x1="10" y1="30" x2="90" y2="30"></line>

                <path d="${areaPath}" fill="url(#completionGradient)"></path>

                <path d="${linePath}" fill="none" stroke="${isSimpleView ? "#4f8dff" : "url(#completionStroke)"}" stroke-width="${isSimpleView ? "0.35" : "0.45"}" stroke-linecap="round" stroke-opacity="${isSimpleView ? "0.8" : "0.9"}"></path>

                ${dateLabelPoints.map(function (point) {
                    return `<circle class="chart-point" cx="${point.x}" cy="${point.y}" r="1.2" fill="#ffffff" stroke="#4f8dff" stroke-width="0.7"></circle>`;
                }).join("")}

            </svg>

            ${isSimpleView ? "" : `<div class="chart-labels">
                ${dateLabelPoints.map(function (point) {
                    return `<span>${point.day}</span>`;
                }).join("")}
            </div>`}

        </div>

    `;

}


/* =========================================
   CURRENT STREAK
========================================= */

function getCurrentStreak(
    habit
) {

    const calendar =
        getCalendar();


    const today =
        new Date();


    let startDay =
        calendar.totalDays;


    if (

        today.getFullYear()
        ===
        calendar.year

        &&

        today.getMonth()
        ===
        calendar.month

    ) {

        startDay =

            Math.min(

                today.getDate(),

                calendar.totalDays

            );

    }


    let streak =
        0;


    for (

        let day =
        startDay;

        day >= 1;

        day--

    ) {

        const key =

            getDataKey(

                habit.id,

                day

            );


        if (
            habitData[key]
        ) {

            streak++;

        }

        else {

            break;

        }

    }


    return streak;

}


function renderStreaks() {

    if (!streakList) {

        return;

    }


    streakList.innerHTML =
        "";


    habits.forEach(

        function (habit) {

            const streak =

                getCurrentStreak(
                    habit
                );


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "streak-item";


            item.innerHTML = `

                <span>

                    ${escapeHTML(
                        habit.name
                    )}

                </span>

                <strong>

                    🔥

                    ${streak}

                    day${

                        streak === 1

                        ?

                        ""

                        :

                        "s"

                    }

                </strong>

            `;


            streakList.appendChild(
                item
            );

        }

    );

}


/* =========================================
   GOALS PAGE
========================================= */

function renderGoalsPage() {

    if (!goalPageList) {

        return;

    }


    goalPageList.innerHTML =
        "";


    habits.forEach(

        function (habit) {

            const completed =

                getHabitCompleted(
                    habit
                );


            const percentage =

                habit.goal > 0

                ?

                Math.min(

                    100,

                    Math.round(

                        completed

                        /

                        habit.goal

                        *

                        100

                    )

                )

                :

                0;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "goal-page-item";


            item.innerHTML = `

                <h3>

                    ${escapeHTML(
                        habit.name
                    )}

                </h3>

                <p>

                    ${completed}

                    completed out of

                    ${habit.goal}

                    days

                </p>

                <div
                    class="goal-big-bar"
                >

                    <span
                        style="
                            width:
                            ${percentage}%;
                        "
                    ></span>

                </div>

                <strong>

                    ${percentage}%

                </strong>

            `;


            goalPageList.appendChild(
                item
            );

        }

    );

}


/* =========================================
   ANALYTICS
========================================= */

function renderAnalytics() {

    if (!analyticsSummary) {

        return;

    }


    const calendar =
        getCalendar();


    const completed =
        getCompletedTotal();


    const possible =

        habits.length

        *

        calendar.totalDays;


    const percentage =

        possible > 0

        ?

        Math.round(

            completed

            /

            possible

            *

            100

        )

        :

        0;


    analyticsSummary.innerHTML = `

        <div class="analytics-card">

            <h3>

                ${calendar.monthName}

                ${calendar.year}

            </h3>

            <p>

                Active habits:

                <strong>

                    ${habits.length}

                </strong>

            </p>

            <p>

                Completed:

                <strong>

                    ${completed}

                </strong>

            </p>

            <p>

                Total possibilities:

                <strong>

                    ${possible}

                </strong>

            </p>

            <p>

                Overall progress:

                <strong>

                    ${percentage}%

                </strong>

            </p>

        </div>

    `;

}


/* =========================================
   RESET CURRENT MONTH
========================================= */

function resetMonth() {

    const confirmReset =

        confirm(

            "Reset all habit checks for this month?"

        );


    if (!confirmReset) {

        return;

    }


    const prefix =

        getMonthKey()

        +

        "|";


    Object.keys(
        habitData
    )
    .forEach(

        function (key) {

            if (

                key.startsWith(
                    prefix
                )

            ) {

                delete habitData[
                    key
                ];

            }

        }

    );


    saveData();

    renderAll();

}


/* =========================================
   DARK MODE
========================================= */

function updateThemeButton() {

    if (!themeToggle) {

        return;

    }


    const darkMode =

        document.body
        .classList
        .contains(
            "dark-mode"
        );


    themeToggle.innerHTML =

        darkMode

        ?

        `

        <span class="nav-icon">

            ☀️

        </span>

        <span class="nav-text">

            Light Mode

        </span>

        `

        :

        `

        <span class="nav-icon">

            🌙

        </span>

        <span class="nav-text">

            Dark Mode

        </span>

        `;

}


function setupTheme() {

    const savedTheme =

        localStorage.getItem(
            THEME_STORAGE
        );


    if (

        savedTheme ===
        "dark"

    ) {

        document.body
        .classList
        .add(
            "dark-mode"
        );

    }


    updateThemeButton();


    if (themeToggle) {

        themeToggle.addEventListener(

            "click",

            function () {

                document.body
                .classList
                .toggle(
                    "dark-mode"
                );


                const theme =

                    document.body
                    .classList
                    .contains(
                        "dark-mode"
                    )

                    ?

                    "dark"

                    :

                    "light";


                localStorage.setItem(

                    THEME_STORAGE,

                    theme

                );


                updateThemeButton();

            }

        );

    }

}


/* =========================================
   NAVIGATION
========================================= */

function setupNavigation() {

    const navItems =

        document.querySelectorAll(
            ".nav-item"
        );


    const sections =

        document.querySelectorAll(
            ".section"
        );


    navItems.forEach(

        function (button) {

            button.addEventListener(

                "click",

                function () {

                    const target =

                        button.dataset
                        .section;


                    navItems.forEach(

                        function (item) {

                            item
                            .classList
                            .remove(
                                "active"
                            );

                        }

                    );


                    sections.forEach(

                        function (section) {

                            section
                            .classList
                            .remove(
                                "active-section"
                            );

                        }

                    );


                    button
                    .classList
                    .add(
                        "active"
                    );


                    const targetSection =

                        document
                        .getElementById(
                            target
                        );


                    if (targetSection) {

                        targetSection
                        .classList
                        .add(
                            "active-section"
                        );

                    }

                }

            );

        }

    );

}


/* =========================================
   SCROLL TO TODAY
========================================= */

function scrollToToday() {

    const wrapper =
        document.querySelector(
            ".table-wrapper"
        );


    const todayCell =
        document.querySelector(
            ".habit-cell.today-cell"
        );


    if (
        !wrapper
        ||
        !todayCell
        ||
        wrapper.clientWidth === 0
    ) {

        return;

    }


    const wrapperRect =
        wrapper.getBoundingClientRect();


    const todayRect =
        todayCell.getBoundingClientRect();


    const targetLeft =

        wrapper.scrollLeft

        +

        todayRect.left

        -

        wrapperRect.left

        -

        (

            wrapper.clientWidth
            /
            2

        )

        +

        (

            todayCell.offsetWidth
            /
            2

        );


    wrapper.scrollTo({

        left:

            Math.max(
                0,
                targetLeft
            ),

        behavior:
            "smooth"

    });

}

/* =========================================
   RENDER EVERYTHING
========================================= */

function renderAll() {

    renderCalendarHeader();

    renderHabitTracker();

    renderStats();

    renderHabitManagement();

    renderGoalAnalysis();

    renderDailyCompletion();

    renderStreaks();

    renderGoalsPage();

    renderAnalytics();

    setTimeout(
        scrollToToday,
        300
    );

}  

/* =========================================
   BUTTON EVENTS
========================================= */

if (addHabitBtn) {

    addHabitBtn.addEventListener(

        "click",

        addHabit

    );

}


if (newHabitInput) {

    newHabitInput.addEventListener(

        "keydown",

        function (event) {

            if (

                event.key ===
                "Enter"

            ) {

                addHabit();

            }

        }

    );

}


if (resetBtn) {

    resetBtn.addEventListener(

        "click",

        resetMonth

    );

}


if (jumpTodayBtn) {

    jumpTodayBtn.addEventListener(

        "click",

        function () {

            scrollToToday();

        }

    );

}


if (monthSelect) {

    monthSelect.addEventListener(

        "change",

        renderAll

    );

}


if (yearSelect) {

    yearSelect.addEventListener(

        "change",

        renderAll

    );

}


if (reminderInput) {

    reminderInput.addEventListener(

        "input",

        function () {

            if (!diaryLocked) {

                saveReminder();

            }

        }

    );

}


if (reminderClearBtn) {

    reminderClearBtn.addEventListener(

        "click",

        function () {

            clearReminder();

        }

    );

}


const diaryLockBtn =
    document.getElementById(
        "diaryLockBtn"
    );


if (diaryLockBtn) {

    diaryLockBtn.addEventListener(

        "click",

        function () {

            toggleDiaryLock();

        }

    );

}


/* =========================================
   START DASHBOARD
========================================= */

loadUser();

loadReminder();

setCurrentDate();

setupTheme();

setupNavigation();

renderAll();