// Copyright (c) 2024 4TiZalewski

// @ts-check

/**
 * @type {HTMLInputElement | null}
 */
const present_nullable = document.querySelector("#present");

/**
 * @type {HTMLButtonElement | null}
 */
const submit_present_btn_nullable = document.querySelector("#submit-present");

/**
 * @type {HTMLSelectElement | null}
 */
const present_category_nullable = document.querySelector("#present-category");

/**
 * @type {HTMLInputElement | null}
 */
const name_nullable = document.querySelector("#name");

/**
 * @type {HTMLButtonElement | null}
 */
const submit_name_btn_nullable = document.querySelector("#submit-name");

/**
 * @type {HTMLElement | null}
 */
const display_nullable = document.querySelector("#display");

/**
 * @type {Map<string, Array<string>>}
 */
const presents = new Map();

if (present_nullable && submit_present_btn_nullable && name_nullable && submit_present_btn_nullable && display_nullable && present_category_nullable) {
    const present = /** @type {HTMLInputElement} */ (present_nullable);
    const submit_present_btn = /** @type {HTMLButtonElement} */ (submit_present_btn_nullable);
    const name = /** @type {HTMLInputElement} */ (name_nullable);
    const submit_name_btn = /** @type {HTMLInputElement} */ (submit_name_btn_nullable);
    const display = /** @type {HTMLElement} */ (display_nullable);
    const present_category = /** @type {HTMLSelectElement} */ (present_category_nullable);

    submit_present_btn.addEventListener("click", (event) => {
        event.preventDefault();

        /**
         * @type {string}
         */
        const value = present.value.trim();
        /**
         * @type {string}
         */
        const category = present_category.value.trim();

        if (value.length > 2) {
            if (category.length) {
                set_or_create(presents, category, value);

                /**
                 * @type {string}
                 */
                let category_name = "";
                present_category.childNodes.forEach((value, _) => {
                    if (value.nodeName == "OPTION") {
                        const option_node = /** @type {HTMLOptionElement} */ (value);
                        if (option_node.value == category) {
                            /**
                             * @type {string | null | undefined}
                             */
                            const text = option_node.firstChild?.textContent;
                            if (text) {
                                category_name = text;
                                return;
                            }
                        }
                    }
                });

                message(display, ["", "i", "", "b"], "Dodałeś ", value, " do ", category_name.toLowerCase());

                present.value = "";
                present_category.value = "";
            } else {
                message(display, [], "Wybierz kategorię prezentu");
            }
        } else {
            message(display, [], "Wprowadź poprawną nazwę prezentu");
        }
    });

    submit_name_btn.addEventListener("click", (event) => {
        event.preventDefault();

        /**
         * @type {string}
         */
        const value = name.value.trim();

        if (value.length > 2) {
            /**
             * @type {HTMLInputElement | null}
             */
            const selected_category_nullable = document.querySelector("input[type=\"radio\"]:checked");
            if (selected_category_nullable) {
                const selected_category = /** @type {HTMLInputElement} */ (selected_category_nullable);
                /**
                 * @type {string[] | undefined}
                 */
                let presents_list;
                if (selected_category.value === "everything") {
                    presents_list = [];
                    /**
                     * @type {IterableIterator<string[]>}
                     */
                    const iterator = presents.values();
                    while (true) {
                        /**
                         * @type {IteratorResult<string[], any>}
                         */
                        const value = iterator.next();
                        if (value.value) {
                            presents_list.push(value.value);
                        } else {
                            break;
                        }
                    }
                } else {
                    presents_list = presents.get(selected_category.value);
                }

                if (presents_list !== undefined && presents_list.length != 0) {
                    /**
                     * @type {string}
                     */
                    let random_present = presents_list[Math.floor(Math.random() * presents_list.length)];
                    message(display, ["b", "", "i"], value, " wylosowany dla Ciebie prezent to: ", random_present);
                    name.value = "";
                    present_category.value = "";
                } else {
                    message(display, [], "Brak prezentów");
                }
            } else {
                message(display, [], "Wybierz preferencje prezentu");
            }
        } else {
            message(display, [], "Wprowadź poprawne imię");
        }
    });
} else {
    console.warn("Required elements are missing!");
}

/**
 * @param {HTMLElement} element 
 */
function clear_children(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 * @param {HTMLElement} display 
 * @param {Array<string>} classes
 * @param  {...string} texts 
 */
function message(display, classes, ...texts) {
    /**
     * @type {HTMLParagraphElement}
     */
    const msg = document.createElement("p");
    msg.className = "msg";

    for (let i = 0; i < texts.length; i++) {
        /**
         * @type {string}
         */
        const text = texts[i];
        /**
         * @type {Text | HTMLElement}
         */
        let text_element = document.createTextNode(text);

        if (classes.length > i) {
            /**
             * @type {string}
             */
            const clazz = classes[i].trim();
            if (clazz.length != 0) {
                text_element = document.createElement(clazz);
                text_element.innerText = text;
            }
        }

        msg.append(text_element);
    }

    clear_children(display);
    display.append(msg);
}

/**
 * @param {Map<string, Array<string>>} map
 * @param {string} key
 * @param {string} value
 */
function set_or_create(map, key, value) {
    /**
     * @type {string[] | undefined}
     */
    let map_key = map.get(key);
    if (map_key === undefined) {
        map_key = [];
    }

    map_key.push(value);
    map.set(key, map_key);
}
