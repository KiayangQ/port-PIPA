import port.api.props as props
from port.api.commands import (CommandSystemDonate, CommandUIRender)

import pandas as pd
import zipfile
from lxml import etree 
import re

def process(sessionId):
    yield donate(f"{sessionId}-tracking", '[{ "message": "user entered script" }]')

    platforms = ["Facebook"]

    subflows = len(platforms)
    steps = 2
    step_percentage = (100/subflows)/steps

    # progress in %
    progress = 0

    for index, platform in enumerate(platforms):
        meta_data = []
        meta_data.append(("debug", f"{platform}: start"))

        # STEP 1: select the file
        progress += step_percentage
        data = None
        while True:
            meta_data.append(("debug", f"{platform}: prompt file"))
            promptFile = prompt_file(platform, "application/zip, text/plain")
            fileResult = yield render_donation_page(platform, promptFile, progress)
            if fileResult.__type__ == 'PayloadString':
                meta_data.append(("debug", f"{platform}: extracting file"))
                extractionResult = doSomethingWithTheFile(platform, fileResult.value)
                if extractionResult != 'invalid':
                    meta_data.append(("debug", f"{platform}: extraction successful, go to consent form"))
                    data = extractionResult
                    break
                else:
                    meta_data.append(("debug", f"{platform}: prompt confirmation to retry file selection"))
                    retry_result = yield render_donation_page(platform, retry_confirmation(platform), progress)
                    if retry_result.__type__ == 'PayloadTrue':
                        meta_data.append(("debug", f"{platform}: skip due to invalid file"))
                        continue
                    else:
                        meta_data.append(("debug", f"{platform}: retry prompt file"))
                        break
            else:
                meta_data.append(("debug", f"{platform}: skip to next step"))
                break

        # STEP 2: ask for consent
        progress += step_percentage
        if data is not None:
            meta_data.append(("debug", f"{platform}: prompt consent"))
            prompt = prompt_consent(platform, data)
            consent_result = yield render_donation_page(platform, prompt, progress)
            if consent_result.__type__ == "PayloadJSON":
                meta_data.append(("debug", f"{platform}: donate consent data"))
                yield donate(f"{sessionId}-{platform}", consent_result.value)

    yield render_end_page()


def render_end_page():
    page = props.PropsUIPageEnd()
    return CommandUIRender(page)


def render_donation_page(platform, body, progress):
    header = props.PropsUIHeader(props.Translatable({
        "en": platform,
        "nl": platform
    }))

    footer = props.PropsUIFooter(progress)
    page = props.PropsUIPageDonation(platform, header, body, footer)
    return CommandUIRender(page)


def retry_confirmation(platform):
    text = props.Translatable({
        "en": f"Unfortunately, we cannot process your {platform} file. Continue, if you are sure that you selected the right file. Try again to select a different file.",
        "nl": f"Helaas, kunnen we uw {platform} bestand niet verwerken. Weet u zeker dat u het juiste bestand heeft gekozen? Ga dan verder. Probeer opnieuw als u een ander bestand wilt kiezen."
    })
    ok = props.Translatable({
        "en": "Try again",
        "nl": "Probeer opnieuw"
    })
    cancel = props.Translatable({
        "en": "Continue",
        "nl": "Verder"
    })
    return props.PropsUIPromptConfirm(text, ok, cancel)


def prompt_file(platform, extensions):
    description = props.Translatable({
        "en": f"You are now ready to donate your Facebook group data. Please use the yellow button below to upload your data(the zipped file named facebook-xxx.zip). ",
        "nl": f"Volg de download instructies en kies het bestand dat u opgeslagen heeft op uw apparaat. Als u geen {platform} bestand heeft klik dan op “Overslaan” rechts onder."
    })

    return props.PropsUIPromptFileInput(description, extensions)


def doSomethingWithTheFile(platform, filename):
    return extract_zip_contents(filename)



def extract_data_file_videos(files, name, type):
    data_set_search = []
    if type == 1 or type == 2 or type == 3:
        try:
            with files.open(name, 'r') as f:
                html = f.read()
                parser = etree.HTMLParser(encoding="utf-8")
                tree = etree.fromstring(html, parser)
        except Exception as e:
            print("Error occurred, no content in search_or_watch file: ", e)
            return data_set_search

        items = tree.xpath("//body//div[contains(@class, '_a705')]/div[contains(@class, '_a706')]/div")
        for item in items:
            data_point = {}
            if (type == 1):
                titles = item.xpath(".//div[contains(@class, '_2ph_') and contains(@class, '_a6-h') and contains(@class, '_a6-i')]/text()")
                texts1 = item.xpath(".//div[contains(@class, '_2ph_') and contains(@class, '_a6-p')]/div/div[2]/div/text()")
                time_stamps = item.xpath(".//div[contains(@class, '_3-94') and contains(@class, '_a6-o')]/a/div/text()")
                data_point['title'] = titles
                data_point['text_post'] = texts1
            elif(type ==2):
                groups = item.xpath(".//div[contains(@class, '_2ph_') and contains(@class, '_a6-p')]/div/div/div/div/text()")
                texts= item.xpath(".//div[contains(@class, '_2ph_') and contains(@class, '_a6-p')]/div/div/div/text()")
                data_point['groups'] = groups
                data_point['text_comment'] = texts
                time_stamps = item.xpath(".//div[contains(@class, '_3-94') and contains(@class, '_a6-o')]/a/div/text()")
            elif(type ==3):
                texts = item.xpath(".//div[contains(@class, '_2ph_') and contains(@class, '_a6-h') and contains(@class, '_a6-i')]/text()")
                data_point['group_title'] = texts
                time_stamps = item.xpath(".//div[contains(@class, '_3-94') and contains(@class, '_a6-o') and contains(@class, '_2pie')]/div/text()")
            data_point['time_stamp'] = time_stamps

            data_set_search.append(data_point)

    return data_set_search




def extract_zip_contents(filename):
    try:
        files = zipfile.ZipFile(filename)
    except zipfile.error:
        return "invalid"
    type_1_found = False
    type_2_found = False
    type_3_found = False

    for name in files.namelist():
        # find search history file
        if re.findall('group_posts_and_comments|your_comments_in_groups|your_group_membership_activity',name):
            if ('group_posts_and_comments' in name ):
                # type 1 = group_posts
                type = 1
                type_1_found =  True
                group_posts = extract_data_file_videos(files,name,type)
            if ('your_comments_in_groups' in name ):
                # type 2 = comments
                type = 2
                type_2_found = True
                comments = extract_data_file_videos(files,name,type)
            if ('your_group_membership_activity' in name ):
                # type 2 = comments
                type = 3
                type_3_found = True
                memberships = extract_data_file_videos(files,name,type)
                # handle missing files
    if type_2_found==False and type_1_found == False:
        return "invalid"
    elif type_1_found==False and type_2_found == True:
        group_posts = []
    elif type_1_found==True and type_2_found == False:   
        comments = []
    elif type_3_found==False:
        return "invalid"
    else:# put all lists together
        data_out = [group_posts,comments,memberships]
        return data_out

def split_dataframe(df, chunk_size):
    chunks = []
    num_chunks = len(df) // chunk_size + 1
    for i in range(num_chunks):
        start = i * chunk_size
        end = min((i + 1) * chunk_size, len(df))
        chunks.append(df[start:end].reset_index(drop=True))
    return chunks

def prompt_consent(id, data):

    post_title = props.Translatable({
        "en": "post",
        "nl": "Inhoud zip bestand"
    })

    comments_title = props.Translatable({
        "en": "comments",
        "nl": "Log berichten"
    })

    
    membership_title = props.Translatable({
        "en": "memberships",
        "nl": "Log berichten"
    })



    # Split 'data_frame_viewing' using the split_dataframe function
    chunk_size = 5000
    data_frame_post = pd.DataFrame(data[0])
    data_frame_comment = pd.DataFrame(data[1])
    result = split_dataframe(data_frame_post, chunk_size)
    result1 = split_dataframe(data_frame_comment, chunk_size)
    
    # Determine the number of dataframes in the result
    num_dataframes = len(result)
    num_dataframes1 = len(result1)
    # Generate the code dynamically
    tables_content = [props.PropsUIPromptConsentFormTable(f"post_content{i+1}", post_title, result[i]) for i in range(num_dataframes)]

    comments = [props.PropsUIPromptConsentFormTable(f"comments{i+1}", comments_title, result1[i]) for i in range(num_dataframes1)]


    group_members = pd.DataFrame(data[2])

    group_members_table = props.PropsUIPromptConsentFormTable("membership activity", membership_title, group_members)


    return props.PropsUIPromptConsentForm([*tables_content,*comments,group_members_table],[])


def donate(key, json_string):
    return CommandSystemDonate(key, json_string)
