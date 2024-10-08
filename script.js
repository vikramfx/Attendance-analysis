document.addEventListener('DOMContentLoaded', function () {
    const submitBtn = document.getElementById('submitBtn');
    const resultsDiv = document.getElementById('results');
    const minDaysSelect = document.getElementById('minDays');
    const attendanceDaysInputs = document.querySelectorAll('#attendanceDays input');

    submitBtn.addEventListener('click', function () {
        const minDays = parseInt(minDaysSelect.value);

        // Collect attendance data
        const attendanceCounts = {};
        const attendanceDetails = {};

        attendanceDaysInputs.forEach((input, dayIndex) => {
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
                            attendanceDetails[email] = []; // Initialize attendance details
                        }
                        attendanceCounts[email]++;
                        attendanceDetails[email].push(`Day ${dayIndex + 1}`);
                    }
                });
            }
        });

        // Filter emails based on minimum days requirement
        const qualifiedEmails = Object.keys(attendanceCounts).filter(email => attendanceCounts[email] >= minDays);

        // Create result table
        let result = `<h3 class="text-center">Results:</h3>`;
        result += `<p class="text-center"><strong>Total Emails Count:</strong> ${Object.keys(attendanceCounts).length}</p>`;
        result += `<p class="text-center"><strong>Total Emails Attended at Least ${minDays} Days:</strong> ${qualifiedEmails.length}</p>`;

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

        // Add option to analyze a particular email
        result += `<div class="mt-4">
                    <label for="analyzeEmail" class="form-label">Analyze Specific Email:</label>
                    <input type="text" id="analyzeEmail" class="form-control" placeholder="Enter email to analyze">
                    <button id="analyzeBtn" class="btn btn-primary mt-2">Analyze</button>
                </div>`;

        resultsDiv.innerHTML = result;

        // Event listener for the Analyze button
        document.getElementById('analyzeBtn').addEventListener('click', function () {
            const analyzeEmail = document.getElementById('analyzeEmail').value.trim();

            if (attendanceCounts[analyzeEmail]) {
                let analyzeResult = `<h4 class="text-center">Analysis for ${analyzeEmail}:</h4>`;
                analyzeResult += `<p class="text-center"><strong>Days Attended:</strong> ${attendanceCounts[analyzeEmail]}</p>`;
                analyzeResult += `<table class="table table-striped mt-3"><thead><tr><th>#</th><th>Day</th></tr></thead><tbody>`;

                attendanceDetails[analyzeEmail].forEach((day, index) => {
                    analyzeResult += `<tr><td>${index + 1}</td><td>${day}</td></tr>`;
                });

                analyzeResult += `</tbody></table>`;
                resultsDiv.innerHTML += analyzeResult;
            } else {
                alert("This email did not attend any days or is not in the list.");
            }
        });
    });
});
