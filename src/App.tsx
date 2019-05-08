import React, { useState } from 'react';
import './App.css';
import { Main } from './components/Main';
import { Sidebar } from './components/Sidebar';
import { parseBeatmap } from './helpers/beatmap-parser';
import { Beatmap, HitObjectMetadata } from './types';

const quaver: Beatmap = {
    "audioFilename": "audio.mp3",
    "audioLeadIn": 0,
    "previewTime": 37767,
    "countdown": 0,
    "stackLeniency": 0,
    "mode": 0,
    "distanceSpacing": 1,
    "beatDivisor": 4,
    "gridSize": 32,
    "title": "quaver",
    "titleUnicode": "quaver ♪",
    "artist": "dj TAKA",
    "artistUnicode": "dj TAKA",
    "creator": "Sotarks",
    "version": "Akitoshi's Easy",
    "source": "REFLEC BEAT limelight",
    "tags": [
        "risk", "junk", "beatmania", "IIDX", "19",
        "Lincle", "jubeat", "saucer", "jukebeat", "KONAMI",
        "music", "pack", "25", "pop'n", "music",
        "Sunny", "Park", "plus", "MUSIC", "PACK",
        "29", "+", "ポップンリズミン", "パック1", "MUSIC",
        "PACK", "19", "cut", "edit", "short",
        "ver", "version", "akitoshi", "corinn", "-laura-",
        "myxomatosis", "desperate-kun", "shunao", "shogunmoon", "kencho",
        "yukiyo", "snownino_", "reform", "kujinn", "yuii-",
        "eiri-", "ayyri", "doormat", "lasse", "onlybiscuit",
        "armin", "a_r_m_i_n", "kyuukai", "yaleufeu", "nevo",
        "monstrata", "fieryrage", "fiery"
    ],
    "beatmapId": 1854033,
    "beatmapSetId": 873811,
    "hpDrainRate": 2,
    "circleSize": 3,
    "overallDifficulty": 2,
    "approachRate": 3,
    "sliderMultiplier": 0,
    "sliderTickRate": 1,
    "colors": [
        {"red": 114, "green": 102, "blue": 255, "alpha": 255},
        {"red": 255, "green": 247, "blue": 91, "alpha": 255},
        {"red": 104, "green": 255, "blue": 209, "alpha": 255},
        {"red": 220, "green": 168, "blue": 255, "alpha": 255}
    ],
    "timingPoints": [],
    "hitObjects": [
        {"x": 256, "y": 192, "startTime": 1198, "flags": 12, "soundType": 2, "metadata": {} as HitObjectMetadata},
        {"x": 297, "y": 198, "startTime": 6472, "flags": 6, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 167, "y": 78, "startTime": 8450, "flags": 1, "soundType": 2, "metadata": {} as HitObjectMetadata},
        {"x": 21, "y": 177, "startTime": 9110, "flags": 6, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 214, "y": 359, "startTime": 10428, "flags": 2, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 267, "y": 204, "startTime": 11088, "flags": 2, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 267, "y": 204, "startTime": 13066, "flags": 6, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 347, "y": 239, "startTime": 14696, "flags": 1, "soundType": 10, "metadata": {} as HitObjectMetadata},
        {"x": 420, "y": 189, "startTime": 15022, "flags": 2, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 359, "y": 48, "startTime": 15674, "flags": 6, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 56, "y": 40, "startTime": 16979, "flags": 2, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 25, "y": 346, "startTime": 18283, "flags": 6, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 234, "y": 276, "startTime": 19261, "flags": 1, "soundType": 10, "metadata": {} as HitObjectMetadata},
        {"x": 253, "y": 190, "startTime": 19587, "flags": 2, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 323, "y": 351, "startTime": 20892, "flags": 6, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 250, "y": 300, "startTime": 22522, "flags": 1, "soundType": 2, "metadata": {} as HitObjectMetadata},
        {"x": 179, "y": 247, "startTime": 22848, "flags": 2, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 14, "y": 261, "startTime": 23500, "flags": 6, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 70, "y": 328, "startTime": 25131, "flags": 1, "soundType": 10, "metadata": {} as HitObjectMetadata},
        {"x": 147, "y": 369, "startTime": 25457, "flags": 2, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 304, "y": 337, "startTime": 26109, "flags": 6, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 357, "y": 51, "startTime": 27413, "flags": 2, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 62, "y": 93, "startTime": 28718, "flags": 6, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 124, "y": 306, "startTime": 29696, "flags": 1, "soundType": 10, "metadata": {} as HitObjectMetadata},
        {"x": 200, "y": 262, "startTime": 30022, "flags": 2, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 164, "y": 89, "startTime": 31326, "flags": 6, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 393, "y": 95, "startTime": 32305, "flags": 1, "soundType": 10, "metadata": {} as HitObjectMetadata},
        {"x": 442, "y": 168, "startTime": 32631, "flags": 2, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 371, "y": 309, "startTime": 33283, "flags": 2, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 256, "y": 192, "startTime": 33935, "flags": 12, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 243, "y": 137, "startTime": 37848, "flags": 6, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 330, "y": 129, "startTime": 38815, "flags": 1, "soundType": 10, "metadata": {} as HitObjectMetadata},
        {"x": 400, "y": 182, "startTime": 39138, "flags": 2, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 351, "y": 337, "startTime": 39783, "flags": 2, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 180, "y": 319, "startTime": 40428, "flags": 6, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 266, "y": 341, "startTime": 42041, "flags": 1, "soundType": 10, "metadata": {} as HitObjectMetadata},
        {"x": 343, "y": 298, "startTime": 42364, "flags": 2, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 280, "y": 146, "startTime": 43009, "flags": 6, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 259, "y": 231, "startTime": 43977, "flags": 1, "soundType": 10, "metadata": {} as HitObjectMetadata},
        {"x": 197, "y": 293, "startTime": 44299, "flags": 2, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 33, "y": 249, "startTime": 44944, "flags": 1, "soundType": 2, "metadata": {} as HitObjectMetadata},
        {"x": 135, "y": 106, "startTime": 45589, "flags": 6, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 195, "y": 169, "startTime": 46557, "flags": 1, "soundType": 10, "metadata": {} as HitObjectMetadata},
        {"x": 280, "y": 146, "startTime": 46880, "flags": 2, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 447, "y": 139, "startTime": 47525, "flags": 1, "soundType": 2, "metadata": {} as HitObjectMetadata},
        {"x": 485, "y": 217, "startTime": 47847, "flags": 1, "soundType": 10, "metadata": {} as HitObjectMetadata},
        {"x": 436, "y": 290, "startTime": 48170, "flags": 6, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 360, "y": 244, "startTime": 49138, "flags": 1, "soundType": 10, "metadata": {} as HitObjectMetadata},
        {"x": 280, "y": 280, "startTime": 49460, "flags": 2, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 125, "y": 225, "startTime": 50106, "flags": 2, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 157, "y": 56, "startTime": 50751, "flags": 6, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 72, "y": 31, "startTime": 52364, "flags": 1, "soundType": 10, "metadata": {} as HitObjectMetadata},
        {"x": 9, "y": 93, "startTime": 52686, "flags": 2, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 75, "y": 235, "startTime": 53331, "flags": 6, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 371, "y": 337, "startTime": 54622, "flags": 2, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 129, "y": 306, "startTime": 55589, "flags": 1, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 75, "y": 235, "startTime": 55912, "flags": 6, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 262, "y": 25, "startTime": 57202, "flags": 2, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 327, "y": 178, "startTime": 57847, "flags": 2, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 304, "y": 360, "startTime": 58493, "flags": 5, "soundType": 6, "metadata": {} as HitObjectMetadata},
        {"x": 209, "y": 376, "startTime": 58815, "flags": 1, "soundType": 2, "metadata": {} as HitObjectMetadata},
        {"x": 126, "y": 326, "startTime": 59138, "flags": 2, "soundType": 0, "metadata": {} as HitObjectMetadata},
        {"x": 256, "y": 192, "startTime": 59783, "flags": 12, "soundType": 0, "metadata": {} as HitObjectMetadata}
    ]
};

const quaverCopy: Beatmap = {
    ...quaver,
    beatmapId: quaver.beatmapId + 1,
    title: 'quaver (copy)',
};

const quaverCopy2: Beatmap = {
    ...quaver,
    beatmapId: quaver.beatmapId + 2,
    title: 'quaver (copy 2)',
};

const App: React.FunctionComponent = () => {
    const [beatmapList, setBeatmapList] = useState<Beatmap[]>([quaver, quaverCopy, quaverCopy2]);
    const [selectedBeatmap, setSelectedBeatmap] = useState<number | null>(0);

    function handleImportBeatmap(beatmapString: string) {
        const beatmap = parseBeatmap(beatmapString);
        setBeatmapList(beatmapList.concat([beatmap]));
    }

    return (
        <div className="page">
            <div className="header">
                osu! Beatmap Analyzer
            </div>

            <div className="body">
                <div className="sidebar">
                    <Sidebar
                        beatmapList={beatmapList}
                        selectedBeatmap={selectedBeatmap}
                        onImportBeatmap={handleImportBeatmap}
                        onSelectBeatmap={beatmapIndex => setSelectedBeatmap(beatmapIndex)}
                    />
                </div>
                <div className="main">
                    <Main
                        beatmap={
                            selectedBeatmap === null
                                ? null
                                : beatmapList[selectedBeatmap]
                        }
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
