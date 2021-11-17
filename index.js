require('dotenv').config();
const { spawn } = require('child_process');
const fs = require('fs');

// const python = spawn('python3', ['fetch.py', `${process.env.USER}`, `${process.env.PASS}`, '2021-12-03']);

// python.on('close', () => {
//     console.log(formatRaw())
// })

formatRaw();

function formatRaw(){
    const raw = fs.readFileSync('./raw.bin', 'utf8');
    const body = raw.split('</style>')[1];
    const notice = body.split('<div class="notice">')[1].split('</div>\r\r\n')[0].split('\n');
    const dates = [];
    const format = [];
    for (i = 0; i < notice.length; i++) {
        notice[i] = notice[i].trim();
        notice[i] = notice[i].replace(/(<p>)|(<\/p>)/gi, '');
    }
    notice.pop();
    notice.shift();
    if (notice[notice.length - 1].includes('<!--')) notice.pop()

    let timetable = body.split('</br>')[1].split('<div>')[0];


    if (timetable.includes('College CAP week')) {
        timetable = timetable.split('</div><table><tr>')[1];
        
        if (timetable.includes('is back to normal...')) {
            timetable = timetable.split('<span class=instructions>')
            timetable[1] = timetable[1].split(`</span>`)[1]

            // Have to handel each section indervidualy
            timetable[]
        } else {
            console.log(timetable)
        }

        console.log(timetable)
        return false;
    } else {
        timetable = timetable.split('<tr><th>')
        timetable.shift();
        timetable.shift();
        
        timetable.forEach(line => dates.push(line.split('<td>').shift()))
        timetable.forEach(line => {
            line = line.replace(/(class=)/gi, 'title=').split('title=')
            line.shift();
            line.forEach(entry => {
                if (entry.startsWith("''></span>")) {
                    if (line.indexOf(entry) > -1) {
                        line.splice(line.indexOf(entry), 1);
                    }
                }
            })
            format.push(line)
        })
       

        format.forEach(line => {
            for (i = 0; i < line.length; i++) {
                if (line[i].startsWith('\'studyPeriod\'')) {
                    line[i] = line[i].split('\'studyPeriod\'>')[1].split('</span><td>')[0].split('</span>')[0]
                } else {
                    const teacher = line[i].split('</span><br>')[1].split('<br><a')[0].replace(/  +/g, ' ');
                    const room = line[i].split('rel=opener>')[1].split('</a><td>')[0].replace(/  +/g, ' ');
                    const subject = line[i].split('</span><br>')[0].split('\'>')[1].replace(/  +/g, ' ');
                    const code = line[i].split('</span><br>')[0].split('\'>')[0].split('\'')[1].replace(/  +/g, ' ');
                    line[i] = `${code}|${subject}|${teacher}|${room}`
                }
            }
            line.unshift(dates[format.indexOf(line)])
        })
    }

    fs.writeFileSync('./timetable.json', JSON.stringify({
        dates: dates,
        notice: notice,
        format: format,
    }, null, '\t'))

    return {
        dates,
        notice,
        format,
    }
}

