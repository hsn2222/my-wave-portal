// WavePortal.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract WavePortal {

    uint256 totalWaves;

    /* 乱数生成のための基盤となるシード（種）を作成 */
    uint256 private seed;

    /*
    * NewWaveイベントの作成
    */
    event NewWave(address indexed from, uint256 timestamp, string message);

    /*
    * Waveという構造体を作成。
    * 構造体の中身は、カスタマイズすることができます。
    */
    struct Wave {
        address waver; //「👋（wave）」を送ったユーザーのアドレス
        string message; // ユーザーが送ったメッセージ
        uint256 timestamp; // ユーザーが「👋（wave）」を送った瞬間のタイムスタンプ
    }

    /*
    * 構造体の配列を格納するための変数wavesを宣言。
    * これで、ユーザーが送ってきたすべての「👋（wave）」を保持することができます。
    */
    Wave[] waves;

    /*
     * "address => uint mapping"は、アドレスと数値を関連付ける
     */
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("WavePortal - Smart Contract!");

        /*
         * 初期シードを設定
         */
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        /*
         * 現在ユーザーがwaveを送信している時刻と、前回waveを送信した時刻が15分以上離れていることを確認。
         */
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );

        /*
         * ユーザーの現在のタイムスタンプを更新する
         */
        lastWavedAt[msg.sender] = block.timestamp;

        /*
         * wave数の更新
         */
        totalWaves += 1;
        console.log("%s waved w/ message %s", msg.sender, _message);

        /*
         * 「👋（wave）」とメッセージを配列に格納。
         */
        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * ユーザーのために乱数を生成
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: %d", seed);

        /*
         * コントラクト側でemitされたイベントに関する通知をフロントエンドで取得できるようにする。
         */
        emit NewWave(msg.sender, block.timestamp, _message);

        /*
         * ユーザーがETHを獲得する確率を50％に設定
         */
        if (seed <= 50) {
            /*
             * ユーザーにETHを送るためのコードは以前と同じ
             */
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
            console.log("%s won! %d send ether", msg.sender, prizeAmount);
        } else {
            console.log("%s did not win.", msg.sender);
		}
    }

    /*
     * 構造体配列のwavesを返してくれるgetAllWavesという関数を追加。
     * これで、私たちのWEBアプリからwavesを取得することができます。
     */
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        // コントラクトが出力する値をコンソールログで表示する。
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}

