class Maths_API {
    static API_URL() { return "https://carnation-truthful-pangolin.glitch.me/api/maths"; }

    static async Get(op, params) {
        let urlParams = new URLSearchParams({ op, ...params }).toString();
        return new Promise(resolve => {
            $.ajax({
                url: this.API_URL() + "?" + urlParams,
                success: result => { resolve(result); },
                error: (xhr) => { console.log(xhr); resolve(null); }
            });
        });
    }
}