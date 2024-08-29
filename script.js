document.addEventListener('DOMContentLoaded', function () {
    const submitBtn = document.getElementById('submitBtn');
    const resultsDiv = document.getElementById('results');
    const minDaysSelect = document.getElementById('minDays');
    const attendanceDaysInputs = document.querySelectorAll('#attendanceDays input');

    submitBtn.addEventListener('click', function () {
        const minDays = parseInt(minDaysSelect.value);

        // Collect attendance data
        const attendanceCounts = {};
        const dailyEmailCounts = [];

        attendanceDaysInputs.forEach(input => {
            const dayAttendance = input.value.trim();
            if (dayAttendance) {
                const presentEmails = dayAttendance.split(/\s+/).map(email => email.trim()).filter(email => email);
                
                // Use a Set to track emails already counted for this day
                const countedEmails = new Set();

                presentEmails.forEach(email => {
                    if (!countedEmails.has(email)) {
                        countedEmails.add(email);

                        if (!attendanceCounts[email]) {
                            attendanceCounts[email] = 0; // Initialize attendance count
                        }
                        attendanceCounts[email]++;
                    }
                });

                // Store the count of emails for this day
                dailyEmailCounts.push(presentEmails.length);
            } else {
                // Store 0 for days with no attendance
                dailyEmailCounts.push(0);
            }
        });

        // Filter emails based on minimum days requirement
        const qualifiedEmails = Object.keys(attendanceCounts).filter(email => attendanceCounts[email] >= minDays);
        const qualifiedCount = qualifiedEmails.length;

        // Create result table
        let result = `<h3 class="text-center">Results:</h3>`;
        result += `<p class="text-center"><strong>Total Emails Count:</strong> ${Object.keys(attendanceCounts).length}</p>`;
        result += `<p class="text-center"><strong>Attendance with Minimum Days (${minDays} days):</strong> ${qualifiedCount} email${qualifiedCount !== 1 ? 's' : ''}</p>`;

        if (qualifiedEmails.length > 0) {
            result += `<table class="table table-striped mt-3"><thead><tr><th>#</th><th>Email</th><th>Days Attended</th></tr></thead><tbody>`;
            
            // Sort emails in descending order based on days attended
            qualifiedEmails.sort((a, b) => attendanceCounts[b] - attendanceCounts[a]);

            qualifiedEmails.forEach((email, index) => {
                result += `<tr><td>${index + 1}</td><td>${email}</td><td>${attendanceCounts[email]}</td></tr>`;
            });

            result += `</tbody></table>`;
        } else {
            result += `<p class="text-center">No emails meet the minimum days requirement of ${minDays} days.</p>`;
        }

        resultsDiv.innerHTML = result;
    });
});
