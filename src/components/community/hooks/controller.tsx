'use client'

import { useEffect, useState } from "react";

export default function useCommunitiesController() {
    const [inputText, setInputText] = useState("");

    return {
        inputText,
        setInputText,
    }
}