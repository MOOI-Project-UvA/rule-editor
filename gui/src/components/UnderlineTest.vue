<template>
    <div class="sentence">
        <span class="one">Lorem ipsum <span class="two">dolor</span> sit amet,</span> consectetur adipiscing elit. <span
            class="one">Maecenas <span class="two"><span class="three">finibus</span></span></span><span class="two">
            aliquam eros eget accumsan. Pellentesque quis <span class="three">diam lacus.</span></span>
    </div>
    <div class="sentence">
        <span class="one">Lorem ipsum</span> <span class="two_test">dolor</span> <span class="one">sit amet,</span>
        consectetur
        adipiscing
        elit. <span class="one">Maecenas <span class="two"><span class="three">finibus</span></span></span><span
            class="two">
            aliquam eros eget accumsan. Pellentesque quis <span class="three">diam lacus.</span></span>
    </div>
    <div class="sentence">
        <span class="decorated-text">To add three differently colored lines under text using CSS</span>
        <span>you</span>
    </div>
    <span :style="getStyleForUnderlining()">asdf</span>

</template>

<script>
export default {
    data: () => ({
        testStyle: { color: "#5555ff", fontSize: "30px" },
        testStyle2: {
            fontSize: "12px",
            color: "black",
            position: "relative",
            paddingBottom: "30px",
            lineHeight: "18px",
            background:
                "linear-gradient(180deg, #000000 2px, #ffffff 2px, #ffffff 4px, #ffff00 4px)",
            backgroundSize: "100% 6px",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "0px"
        }
    }),
    methods: {
        getStyleForUnderlining() {
            return {
                paddingBottom: "30px",
                lineHeight: "18px",
                background:
                    "linear-gradient(180deg, #000000 2px, #ffffff 2px, #ffffff 4px, #ffff00 4px)",
                backgroundSize: "100% 6px",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "0px"
            }
        }
    }
}
</script>

<style scoped>
.underlined {
    background-position: 0 100%;
}

.one {
    line-height: 20px;
    background: linear-gradient(0deg, green 2px, #ffffff 1px, transparent 1px);

}

.two {
    line-height: 24px;
    background: linear-gradient(0deg, rgb(255, 242, 0) 2px, #ffffff 1px, transparent 1px);
    padding-bottom: 4px;
}

.three {
    line-height: 28px;
    background: linear-gradient(0deg, rgb(255, 0, 238) 2px, #ffffff 1px, transparent 1px);
    padding-bottom: 8px;
}

.two_test {
    line-height: 24px;
    background: linear-gradient(0deg, green 2px, #ffffff 1px, transparent 1px, rgb(255, 242, 0) 2px, #ffffff 1px, transparent 1px);
    padding-bottom: 4px;
}

.sentence {
    width: 200px;
}

.decorated-text {
    font-size: 12px;
    /* Adjust font size as needed */
    color: black;
    /* Text color */
    position: relative;
    padding-bottom: 6px;
    /* Space for lines */
    line-height: 24px;
    /* Total height of all lines */
    background:
        linear-gradient(to right, red, red),
        /* First line, red */
        linear-gradient(to right, green, green),
        /* Second line, green */
        linear-gradient(to right, blue, blue);
    /* Third line, blue */
    background-size: 100% 2px;
    /* Each line takes full width and 2px height */
    background-repeat: no-repeat;
    background-position: 2px, 4px, 6px;
    /* Position each line */
}
</style>