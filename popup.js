function formatRequestData() {
    return {
        "messages": [
            {
                "role": "system",
                "content": `Based on the cover letter samples below , i want you to write me a cover letter for my job position "${$("#job-position").val()}" at "${$("#company-name").val()}" , I am sharing a few details about the job post \n\n1. About me\n${$("#about-me").val()}\n\n2. My experiences and contributions\n${$("#experiences-contributions").val()}\n\n3. My certificates and Education\n${$("#certificates-education").val()}\n\n4. Mention stuff you cannot do or don't want to do\n${$("#cant-do-dont-want").val()}\n\n5. Cover letter samples\n${$("#cover-letter-samples").val()}\n\n\n---------\n\n6. Job position \n${$("#job-position").val()}\n\n7. Company Name \n${$("#company-name").val()}\n\n8. Stuff they want from you \n${$("#job-requirements").val()}\n\n\nNote: Make sure to include the bit about my story, don't keep talking about tech all the time.\n\n\n⏬  COVER LETTER SAMPLES BELOW for REFERENCE ⏬\n====================\n\n${$("#cover-letter-samples").val()}`
            }
        ]
    };
}

$(document).ready(function () {
    const fieldsToSave = [
        "about-me",
        "experiences-contributions",
        "certificates-education",
        "cant-do-dont-want",
        "cover-letter-samples"
    ];

    function loadFieldsFromStorage() {
        fieldsToSave.forEach(field => {
            chrome.storage.sync.get(field, items => {
                if (items[field]) {
                    $(`#${field}`).val(items[field]);
                }
            });
        });
    }

    function saveFieldsToStorage() {
        fieldsToSave.forEach(field => {
            chrome.storage.sync.set({ [field]: $(`#${field}`).val() });
        });
    }

    function setLoadingIndicator(isLoading) {
        if (isLoading) {
            $("#generate-btn").prop("disabled", true);
            $("#loading-progress").show();
        } else {
            $("#generate-btn").prop("disabled", false);
            $("#loading-progress").hide();
        }
    }

    loadFieldsFromStorage();

    $("#generate-btn").on("click", function () {
        setLoadingIndicator(true);
        saveFieldsToStorage();

        $.ajax({
            type: "POST",
            url: "https://botbase-cors-server.onrender.com/https://chatgpt-b7ep.onrender.com/get_response",
            headers: {
                "Content-Type": "application/json"
            },
            processData: false,
            data: JSON.stringify(formatRequestData()),
            success: function (response) {
                $("#result-code").html(response.result);
                setLoadingIndicator(false);
            },
            error: function (error) {
                console.log("Error:", error);
                setLoadingIndicator(false);
            }
        });
    });

    $("#copy-btn").on("click", function () {
        const textToCopy = $("#result-code").text();
        navigator.clipboard.writeText(textToCopy).then(function() {
            console.log("Copied!");
        }, function() {
            console.log("Failed to copy.");
        });
    });
});