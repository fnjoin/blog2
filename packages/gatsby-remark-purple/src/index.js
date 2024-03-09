module.exports = ({ markdownAST }, pluginOptions) => {
    // Manipulate AST
    console.log("the ast", JSON.stringify(markdownAST, null, 2));
    return markdownAST;
};
