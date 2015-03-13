var async = require('async')
var request = require('request')

var testData = {
    testSuites: [
        {
            name: "Row 1"
            , urls: [
                "http://23h1rq2wr18220xqby25x0kq.wpengine.netdna-cdn.com/wp-content/uploads/2015/03/app-icon.jpeg"
                , "http://23h1rq2wr18220xqby25x0kq.wpengine.netdna-cdn.com/wp-content/uploads/2015/02/instagram-app-icon.jpeg"
                , "http://23h1rq2wr18220xqby25x0kq.wpengine.netdna-cdn.com/wp-content/uploads/2014/11/app-icon1.png"
            ]
        }
        , {
            name: "Row 2"
            , urls: [
                "http://23h1rq2wr18220xqby25x0kq.wpengine.netdna-cdn.com/wp-content/uploads/2014/11/app-icon.png"
                , "http://dy7kfdu8nfzkx.cloudfront.net/wp-content/uploads/2014/10/inbox.jpg"
                , "http://dy7kfdu8nfzkx.cloudfront.net/wp-content/uploads/2014/08/hyperlapse.jpg"
            ]
        }
    ]
}

var PARALLEL_TEST_SUITE_LIMIT = 1; // How many test suite run in parallel
var PARALLEL_DOWNLOAD_LIMIT = 1; // How many urls are fetched in parallel for a given test suite
var REPETITIONS = 3; // How many repetitions are executed for each url

function requestImage(url, onRequestCompleted) {
    var start = new Date();
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            onRequestCompleted(start, new Date())
        }
    })
}

function downloadImagesSeries() {
    async.mapLimit(
        testData.testSuites
        , PARALLEL_TEST_SUITE_LIMIT
        , function(testSuite, onTestSuiteFinished) {
            async.mapLimit(
                testSuite.urls
                , PARALLEL_DOWNLOAD_LIMIT
                , function (url, onUrlFinished) {
                    async.timesSeries(
                        REPETITIONS
                        , function(i, onRequestFinished) {
                            requestImage(url, function (startTime, endTime) {
                                onRequestFinished(null, endTime - startTime)
                            })

                        }
                        , function(err, times) {
                            var sum = times.reduce(function(a, b) { return a + b; });

                            onUrlFinished(null, {url: url, time: (sum / times.length) })
                        }
                    )
                }
                , function (err, urlsTimes) {
                    onTestSuiteFinished(null, { name: testSuite.name, times: urlsTimes })
                }
            )
        }
        , function(err, testSuiteResults) {
            printResults(testSuiteResults)
        }
    )
}

function printResults(testDataResults) {
    console.log("Perfomance Script Results")
    console.log("========================")

    testDataResults.forEach(function(testSuite) {
        console.log("Results for " + testSuite.name + ": ")
        var total = 0
        testSuite.times.forEach(function(element) {
            console.log("URL: " + element.url + ". Time: " + element.time.toFixed(2))
            total += element.time
        })

        console.log("TOTAL: " + total.toFixed(2))
        console.log("AVERAGE: " + (total / testSuite.times.length).toFixed(2))
        console.log("\r\n")
    })

    console.log("Finished Performance Script")
    console.log("========================")
}

downloadImagesSeries()