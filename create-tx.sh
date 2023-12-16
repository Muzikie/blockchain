#!/bin/bash

passphrases=(
    "shoot shift prefer maid lonely mixed room random evil describe acoustic tired"
    "credit payment lens fault affair gospel catalog oyster solution library truck hero"
    "target cancel solution recipe vague faint bomb convince pink vendor fresh patrol"
    "avoid good plug behave special pull attend eagle crack fan sibling retire"
    "render define require blade bar clap trial method defy captain engine embark"
    "ordinary immense rookie avoid finger drastic enforce merry emerge gold rubber bubble"
    "school senior cannon ostrich culture come quote next put addict offer kid"
    "common scrap two plate inside produce voice place degree certain dwarf artwork"
    "guard segment tortoise faith today strategy wine equip life blouse tent reunion"
    "verb verb breeze scheme snap hip erosion miracle output shove half combine"
)

addresses=(
    "lskh96jgzfftzff2fta2zvsmba9mvs5cnz9ahr3ke"
    "lskk3qzuz8rpbpqd9j9mwwed2gd2dn39pqpdfgwyh"
    "lskhqy429nwm2tew3j5j29ef6pguyynf6jxcmgrh2"
    "lsketddzhtynhjteuekko4gbg574nft7dokvhb9ka"
    "lskeo392bofrnqb7sj3b7dvfrx3kgcfup9bpmk355"
    "lskaknrp3mfxbp5urxz2yowm4d3uhssqvorx5s6ew"
    "lskaqwf27et62x4awray67fbxrxhs8sm5wbkoc2qq"
    "lskb9q668eoz37prna9g5tnb292tzery23pwd4k4f"
    "lsk2ugpaccp3y2vqun2dxtm7k4cbrquowbbsyfe2q"
    "lsk8sgv53gm6kv222fn3g5xt6s7sge6bmpveurf9e"
)


# Transfer Tokens
for ((i=0; i<10; i++)); do
    nonce=$((i + 14)) 
    ./bin/run transaction:create token transfer 10000000 --passphrase="economy cliff diamond van multiply general visa picture actor teach cruel tree adjust quit maid hurry fence peace glare library curve soap cube must" --params='{"tokenID": "0400000300000000","data": "","amount": "10000000000","accountInitializationFee":"5000000","recipientAddress": "'"${addresses[i]}"'"}' --nonce=${nonce} --json --pretty --send
    sleep 1s
done

# Create Anchors
for ((i=0; i<250; i++)); do
    index=$((i + 230))
    random_album="Album_$index"
    random_artist="Artist_$index"
    random_spotify_id="ID_$index"

    account_index=$((i % 10))
    passphrase=${passphrases[$account_index]}

    params="{\"album\":\"$random_album\",\"artists\":\"$random_artist\",\"images\":[{\"height\":64,\"url\":\"https://i.scdn.co/image/ab67616d0000485180c82761e4335b3a6ae6f7c5\",\"width\":64}],\"name\":\"Evasion\",\"spotifyId\":\"$random_spotify_id\",\"appleMusicId\":\"\"}"

    # Run the transaction command
    ./bin/run transaction:create anchor create 2000000 --passphrase="$passphrase" --params="$params" --send

    if [ $account_index -eq 9 ]; then
        sleep 20 && echo "Waiting for 20 seconds..."
    fi
done



