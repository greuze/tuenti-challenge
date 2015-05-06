var fs = require('fs');

var sheet = fs.readFileSync('sheet.data').toString().split('\n');
var dimensions = sheet[0].split(' ');
var M = parseInt(dimensions[0]);
var N = parseInt(dimensions[1]);
var a = new Array(M);
for (var i = 0; i < M; i++) {
    a[i] = new Array(N);
    var line = sheet[i + 1].split(' ');
    for (var j = 0; j < N; j++) {
        a[i][j] = parseInt(line[j]);
    }
}

/*var a = [
        [1, 4, 2, 6, 8, 1, 2],
        [7, 2, 9, 1, 8, 4, 4],
        [4, 2, 3, 3, 8, 3, 1],
        [8, 8, 1, 1, 5, 5, 1],
        [7, 3, 3, 1, 7, 1, 3],
        [1, 4, 2, 6, 8, 1, 2],
        [7, 2, 9, 1, 8, 4, 4],
        [1, 4, 2, 6, 8, 1, 2],
        [7, 2, 9, 1, 8, 4, 4]
];*/

var input = process.argv[2];
var lines = fs.readFileSync(input).toString().split('\n');
var T = parseInt(lines[0]);

for (var i = 1; i <= T; i++) {
    var line = lines[i].split(' ');
    console.log('Case ' + i + ': ' + calculateMax(line));
}

function calculateMax(line) {
    var maxSum = 0;
    var y0 = parseInt(line[0]);
    var x0 = parseInt(line[1]);
    var y1 = parseInt(line[2]);
    var x1 = parseInt(line[3]);
    var k = parseInt(line[4]);

    var column = new Array(y1 - y0 - k);
    for (var j = y0, m = 0; j <= (y1 - k + 1); j++, m++) {
        var size = x1 - x0 + 1;
        if (j <= k || j > x1 - k) {
            size = size - k - 1;
        }
        column[m] = new Array(size);
        if (m == 0) {
            for (var l = x0, n = 0; n < size; l++, n++) {
                column[m][n] = columnSum(j, l, k);
            }
        } else if (m == k + 1) {
            for (var l = x0, n = 0; l < x1 - k; l++, n++) {
                if ((j <= (y1 - k - k) || n > k) && column[m-1][n]) {
                    column[m][n] = column[m-1][n] + a[j + k - 1][l] - a[j - 1][l];
                }
            }
            for (var l = x1 - k; l <= x1; l++, n++) {
                column[m][n] = columnSum(j, l, k);
            }
        } else {
            for (var l = x0, n = 0; l <= x1; l++, n++) {
                if ((j <= (y1 - k - k) || n > k) && column[m-1][n]) {
                    column[m][n] = column[m-1][n] + a[j + k - 1][l] - a[j - 1][l];
                }
            }
        }
    }

    for (var j = 0; j <= (y1 - y0 - k - k); j++) {
        for (var l = 0; l <= (x1 - x0 - k - k); l++) {
            maxSum = Math.max(maxSum, airscrewSum(j, l, k));
        }
    }
    return maxSum;

    function airscrewSum(y, x, k) {
        var sum = 0;
        for (var z = 0; z < k; z++) {
            sum += column[y][x + z];
            sum += column[y + k + 1][x + k + 1 + z];
        }
        return sum;
    }
}

function columnSum(y, x, k) {
    var sum = 0;
    for (var z = 0; z < k; z++) {
        sum += a[y + z][x];
    }
    return sum;
}

