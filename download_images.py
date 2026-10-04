import requests
import os
from pathlib import Path

OUTPUT_DIR = Path("images")

urls = [
    "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/4aae4ed7-5939-4e76-b100-e69440ebeae4.png?im_w=240",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/b582b83f-92cb-498f-a83e-03a1de6d898c.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/a1b1c9e8-35e7-41f0-928f-35edfaab180d.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/68db2427-299c-4ee8-8cb6-300638a8cf0f.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/7b7c7baa-6409-471b-90df-b5b99eb37dff.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/75d34bd5-489d-45fe-8f3a-d56ae7fd815d.jpeg?im_w=720",
    "https://a0.muscache.com/im/users/21869319/profile_pic/1411912753/original.jpg?im_w=120",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/ac0ccc5b-d61f-4687-92d4-9f1d8a391936.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/c0a5b5da-e201-43f6-9bc0-7e4c9008fcd6.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-4214069/original/cabbe38e-7c8f-4ff0-8c39-7ea2b71413f8.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-4214069/original/08a6fd21-1c99-417e-a86b-5c4cff2ada35.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/hosting/Hosting-4214069/original/2f82d404-c10b-4b71-b430-16d36a9674cd.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/AirbnbPlatformAssets/AirbnbPlatformAssets-Review-AI-Synthesis/original/b5957392-bf60-4304-8666-c030859eebf7.png?im_w=120",
    "https://a0.muscache.com/im/pictures/AirbnbPlatformAssets/AirbnbPlatformAssets-Review-AI-Synthesis/original/0c22a2ee-a0ab-4baf-8063-9d188f769ab9.png?im_w=120",
    "https://a0.muscache.com/im/pictures/AirbnbPlatformAssets/AirbnbPlatformAssets-Review-AI-Synthesis/original/481a6680-46b2-4c94-91e9-d7917d97b660.png?im_w=120",
    "https://a0.muscache.com/im/pictures/AirbnbPlatformAssets/AirbnbPlatformAssets-Review-AI-Synthesis/original/16826b98-38d0-4424-9b11-20b0155d522a.png?im_w=120",
    "https://a0.muscache.com/im/pictures/AirbnbPlatformAssets/AirbnbPlatformAssets-Review-AI-Synthesis/original/8ab51c28-bc4b-464e-8e54-f391fc36f132.png?im_w=120",
    "https://a0.muscache.com/im/pictures/AirbnbPlatformAssets/AirbnbPlatformAssets-Review-AI-Synthesis/original/c1ebe817-e327-4dd9-b172-d88ebaf38d11.png?im_w=120",
    "https://a0.muscache.com/im/pictures/AirbnbPlatformAssets/AirbnbPlatformAssets-Review-AI-Synthesis/original/1d5a4065-220e-4d80-b44f-019dd4a0ae68.png?im_w=120",
    "https://a0.muscache.com/im/pictures/AirbnbPlatformAssets/AirbnbPlatformAssets-Review-AI-Synthesis/original/74dbfb1b-3b77-4472-abd5-949004b98b7f.png?im_w=120",
    "https://a0.muscache.com/im/pictures/AirbnbPlatformAssets/AirbnbPlatformAssets-Review-AI-Synthesis/original/e4546c79-fd9d-412c-862b-7faade48f32e.png?im_w=120",
    "https://a0.muscache.com/im/pictures/AirbnbPlatformAssets/AirbnbPlatformAssets-Review-AI-Synthesis/original/c6373272-edcf-4f5c-a215-78ae3d706e92.png?im_w=120",
    "https://a0.muscache.com/im/users/21869319/profile_pic/1411912753/original.jpg?im_w=240",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/68db2427-299c-4ee8-8cb6-300638a8cf0f.jpeg?im_w=1200",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/cef39c74-3d11-4b1d-ba56-07f132c5d3fa.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/ed1996cb-4e4c-4d84-8972-362145553a17.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/f1735405-36d6-4134-a435-30b05cb588aa.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/e9efdd5c-fe86-488b-b97b-22dfddeec8d0.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/b967bb6f-d998-4282-900c-7fa67bb6eafc.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/d99fbc89-5d7c-4238-ae3a-793a88d90dd2.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/5b5f56de-76c6-488f-a35c-43d7357e0e73.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/fae2c0b0-1ac4-4997-b163-5a0e2fb8d0ad.jpeg?im_w=1200",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/6e08a843-3e5a-4831-9e24-4f6d93236870.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/fe703ddd-5b14-44c5-92cd-bdb647173e82.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/de6efc15-69bf-4782-af94-b63effd2a0b3.jpeg?im_w=1200",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/57ea96d8-e408-403e-bbb0-17754ae1dd98.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/00383620-2dc4-4458-92ec-348ab29a2d20.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/0e815f18-81b4-4115-a6b0-aed5f3ff939d.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/5754f7a5-2202-4eeb-b91e-88ae7a2050cd.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/851046a7-7e7c-4ab6-814d-3ab59065ca93.jpeg?im_w=720",
    "https://a0.muscache.com/im/pictures/miso/Hosting-4214069/original/ac0ccc5b-d61f-4687-92d4-9f1d8a391936.jpeg?im_w=1200",
    "https://verifi.pdscrb.com/tag?action=view&user_id=62a14177-f845-455c-99f0-abf77e605230&advertiser=airbnb&referrer=https%3A%2F%2Fwww.google.com%2F&session_referrer=https%3A%2F%2Fwww.google.com%2F&session_landing_url=https%3A%2F%2Fwww.airbnb.com%2Frooms%2F4214069%3Fsource_impression_id%3Dp3_1785077022_P3W9jFO6z09eWlaG%26modal%3DPHOTO_TOUR_SCROLLABLE&device_id=pscrb_9cc08852-013e-4661-b44d-2c74c4469980&first_visited_at=1785077024888&stid=&ipv4=162.83.158.44&ipv6=&url=https%3A%2F%2Fwww.airbnb.com%2Frooms%2F4214069%3Fsource_impression_id%3Dp3_1785077022_P3W9jFO6z09eWlaG%26modal%3DPHOTO_TOUR_SCROLLABLE&event_url=https%3A%2F%2Fwww.airbnb.com%2Frooms%2F4214069%3Fsource_impression_id%3Dp3_1785077022_P3W9jFO6z09eWlaG%26modal%3DPHOTO_TOUR_SCROLLABLE&source=js-tag+v1.2.2&cachebust=1785077024961&meta=%7B%22product_name%22%3A%22Beautiful+beachfront+ForodhaniHouse%22%2C%22product_description%22%3A%22Stunningly+located+at+the+beginning+of+Shella+Beach%2C+100+meters+from+the+village+and+Peponi+Terrace.+We+want+to+make+sure+your+holidays+here%2C+whether+with+family+or+friends%2C+are+both+relaxing+and+interesting.+And+a+bit+magic+too%21%22%7D"
]

if __name__ == "__main__":
    for url in urls:
        url = url.split("?")[0]
        response = requests.get(url)
        if response.status_code == 200:
            output_path = OUTPUT_DIR / f"{url.split('/')[-1]}"
            with open(output_path, "wb") as f:
                f.write(response.content)
            print(f"Downloaded {url} to {output_path}")
        else:
            print(f"Failed to download {url}")

    print("Done")

